import _ from 'lodash'  
import Mailer from '~~/server/libs/mailer' 
import ContactTemplate from '~~/server/views/contact' 

export default defineEventHandler( async (event) => {
  try {
    let mailer = Mailer()
    let { target, email, subject, message, name, project } = await readBody(event) 
      
    let ip =  _.get(event.node.req, "headers['x-real-ip']", _.get(event, "node.req.headers['x-forwarded-for']"))
    let template = mailer.buildTemplate(ContactTemplate, { name, email, message, ip, url:project })

    let params = {
      to: target, 
      replyTo: email,
      subject: 'Contact - '+subject ,
      html: template,
      text: template.replace('<br>', '\\r\\n'),
    } as any

    let mail = await mailer.sendSync(params)    

    return {
      message: 'Message sent'
    }
  } catch (error) {
    console.error('contact', error)
    throw createError({
      statusCode: 400,
      statusMessage: error.message
    })
  }
})

