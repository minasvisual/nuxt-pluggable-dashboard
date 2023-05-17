import _ from 'lodash'  
import Mailer from '~~/server/libs/mailer' 
import ContactTemplate from '~~/server/views/contact' 

export default defineEventHandler( async (event) => {
  try {
    let mailer = Mailer()
    let { target, email, subject, message, name, recaptcha } = await readBody(event) 
      
    let ip =  _.get(event.node.req, "headers['x-real-ip']")
    let template = mailer.buildTemplate(ContactTemplate, { name, email, message, ip })

    let params = {
      to: target,
      replyTo: email,
      subject: 'Contact coursestube - '+subject ,
      html: template,
      text: template,
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

