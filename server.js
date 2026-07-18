import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import pg from 'pg'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Inicializar pool de conexiones a la base de datos de PostgreSQL (Supabase)
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
})

// 1. Endpoint para crear la preferencia de pago en Mercado Pago
app.post('/api/payments/create-preference', async (req, res) => {
  try {
    const { quantity, companions, userDni, userEmail, eventId } = req.body

    if (!quantity || !userDni || !eventId) {
      return res.status(400).json({ error: 'Faltan parámetros requeridos (quantity, userDni, eventId).' })
    }

    // A. Validar aforo del evento (Consultando directamente a PostgreSQL para bypass de RLS)
    const eventRes = await pool.query('SELECT title, quota FROM eventos WHERE id = $1', [eventId])
    if (eventRes.rowCount === 0) {
      return res.status(404).json({ error: 'Evento no encontrado en la base de datos.' })
    }
    const event = eventRes.rows[0]

    // Consultar inscripciones activas
    const countRes = await pool.query('SELECT COUNT(*) FROM inscripciones WHERE event_id = $1 AND status != \'Cancelado\'', [eventId])
    const currentQuota = parseInt(countRes.rows[0].count, 10)
    
    if (currentQuota + quantity > event.quota) {
      return res.status(400).json({ error: 'El aforo para este evento ya está completo.' })
    }

    // B. Crear la preferencia en el API de Mercado Pago
    let origin = 'http://localhost:5173'
    if (req.headers.referer) {
      try {
        const refUrl = new URL(req.headers.referer)
        origin = refUrl.origin
      } catch (e) {}
    } else if (req.headers.origin && req.headers.origin !== 'null') {
      origin = req.headers.origin
    }
    console.log('Resolved origin:', origin)

    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        items: [
          {
            title: `Entrada(s) - ${event.title}`,
            unit_price: 180.00,
            quantity: quantity,
            currency_id: 'PEN'
          }
        ],
        back_urls: {
          success: `${origin}/dashboard?tab=eventos&payment_status=approved`,
          failure: `${origin}/encuentro-internacional?fase=sep3&payment_status=rejected`,
          pending: `${origin}/dashboard?tab=eventos&payment_status=pending`
        },
        notification_url: 'https://sesquitec-webhook-placeholder.requestcatcher.com/test', // Reemplazar por url pública en producción (ej. ngrok)
        external_reference: JSON.stringify({ userDni, eventId, userEmail })
      })
    })

    if (!mpResponse.ok) {
      const errText = await mpResponse.text()
      console.error('Error al crear preferencia en Mercado Pago:', errText)
      return res.status(500).json({ error: 'Error de comunicación con la pasarela de pagos.' })
    }

    const preference = await mpResponse.json()

    // C. Registrar pago en estado 'Pendiente' en la base de datos (Bypass de RLS)
    await pool.query(
      `INSERT INTO pagos (preference_id, user_dni, event_id, monto, estado, metodo_pago, acompanantes) 
       VALUES ($1, $2, $3, $4, 'Pendiente', 'MERCADO_PAGO', $5)`,
      [preference.id, userDni, eventId, quantity * 180.00, JSON.stringify(companions)]
    )

    // Retornamos el preferenceId y el enlace del checkout sandbox
    res.json({
      preferenceId: preference.id,
      initPoint: preference.sandbox_init_point
    })

  } catch (err) {
    console.error('Error interno del servidor:', err)
    res.status(500).json({ error: 'Error interno del servidor.' })
  }
})

// 2. Webhook para recibir notificaciones de cobro desde Mercado Pago (IPN / Webhooks)
app.post('/api/payments/webhook', async (req, res) => {
  try {
    const { action, type, data } = req.body

    if (action === 'payment.created' || type === 'payment' || action === 'payment.updated') {
      const paymentId = data.id

      // Consultar el estado real del pago directamente a Mercado Pago
      const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`
        }
      })

      if (mpRes.ok) {
        const payment = await mpRes.json()
        const preferenceId = payment.order?.id || payment.preference_id

        if (payment.status === 'approved') {
          // A. Buscar el pago correspondiente
          const pagoRes = await pool.query('SELECT * FROM pagos WHERE preference_id = $1', [preferenceId])

          if (pagoRes.rowCount > 0) {
            const pago = pagoRes.rows[0]
            
            if (pago.estado === 'Pendiente') {
              // B. Actualizar estado del pago a 'Aprobado'
              await pool.query(
                `UPDATE pagos SET estado = 'Aprobado', payment_id = $1, metodo_pago = $2 WHERE id = $3`,
                [String(paymentId), payment.payment_method_id.toUpperCase(), pago.id]
              )

              // C. Registrar la inscripción oficial en Supabase
              const qrCode = `UNI-150-TKT-sep3-${pago.user_dni}-${Math.floor(Math.random() * 900000 + 100000)}`
              
              await pool.query(
                `INSERT INTO inscripciones (user_dni, event_id, status, qr_code, acompanantes) 
                 VALUES ($1, $2, 'Registrado', $3, $4)
                 ON CONFLICT (user_dni, event_id) DO NOTHING`,
                [pago.user_dni, pago.event_id, qrCode, JSON.stringify(pago.acompanantes || [])]
              )
            }
          }
        }
      }
    }

    res.sendStatus(200)
  } catch (err) {
    console.error('Error al procesar el Webhook de Mercado Pago:', err)
    res.sendStatus(500)
  }
})

// 3. Endpoint para consultar el estado del pago (Polling desde el frontend)
app.get('/api/payments/status/:preferenceId', async (req, res) => {
  try {
    const { preferenceId } = req.params
    const pagoRes = await pool.query('SELECT estado FROM pagos WHERE preference_id = $1', [preferenceId])

    if (pagoRes.rowCount === 0) {
      return res.status(404).json({ error: 'Pago no encontrado.' })
    }

    res.json({ estado: pagoRes.rows[0].estado })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error de servidor.' })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`[OK] Servidor backend escuchando en puerto ${PORT}`)
})
