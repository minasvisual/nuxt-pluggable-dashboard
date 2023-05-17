import _ from 'lodash'
import nodemailer from 'nodemailer'  

export default () => {  
  let transporter = {}  
  
  const init = async () => {
    if( !process.env.SMTP_URL ) return console.warn('SMTP URL unavailable')

    // user|pass|host|port|host
    const [SMTP_USER,SMTP_PASS,SMTP_HOST,SMTP_PORT,SMTP_REMOTE] = (process.env.SMTP_URL || '').split('|')

    transporter = nodemailer.createTransport({
        name: SMTP_REMOTE,
        host: SMTP_HOST,
        port: parseInt(SMTP_PORT),
        secureConnection: true, // true for 465, false for other ports
        auth: {
            user: SMTP_USER, // generated ethereal user
            pass: SMTP_PASS  // generated ethereal password
        },
        tls: {
          // do not fail on invalid certs
          rejectUnauthorized: false,
          ciphers:'SSLv3'
        }
    });
    
    transporter.verify(function(error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log("Server is ready to take our messages");
      }
    });
  }
  init();

  // send mail with defined transport object
  const send = async function(params, cb){
        const Logger = console
        const [SMTP_USER] = (process.env.SMTP_URL || '').split('|')
          // setup email data with unicode symbols
        let mailOptions = {
            from: SMTP_USER, // sender address
            to: _.get( params, 'to','mantovaniarts@hotmail.com'), // list of receivers
            subject: _.get( params, 'subject','Erro myguild'), // Subject line
            text: _.get( params, 'text', 'HTML Text Disable'), // plain text body
            html: _.get( params, 'body', _.get(params, 'text', 'Content undefined').replace(/\r\n/g, "<br />") ) // html body
        };
    
        return transporter.sendMail(mailOptions, (error, info) => {
          if(cb) cb(error, info)
          
          if (error) {
              Logger.error('Error to send emails', {
                body: mailOptions,           
                error: error.toString()
              })
              return {status: false, message: error};
          }
          return {status: true, message:'Mensagem enviada:'+ info.messageId};
        })
    }
  
  const sprintf = (html, obj) => {
      if( !html ) return false;
      return html.replace(/\{\s?([^}|\s]*)\s?}/g, (r,k) => _.get(obj, k) );
  } 
  
  const buildTemplate = (template:string, data:any) => {   
    _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
    return _.template(template)(data)
  }

  var sendSync = (params) => new Promise((res, rej) => {
    send(params, (err, data) => {
        if( err) rej(err)
        else res(data)
    })
  })
  
  return {
    send,
    sendSync,
    buildTemplate,
  }
}