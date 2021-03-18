import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { isEmpty } from 'lodash'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import passport from 'passport'
import randomstring from 'randomstring'
import sendMail from '../services/sendMail'
import { hashPassword } from '../utils/password'
import validateSignup from '../validation/signup'


const api = Router()

api.post('/signup', async (req, res) => {

  const { name, firstname, gender, date, email, password } = req.body

  const prisma = new PrismaClient()
  try {
   const {error} =  await validateSignup(req.body)
   if(error){
     console.error({error: `${error.details[0].message}`})
     return res.status(400).json({error: `${error.details[0].message}`})
   }

    const user = await prisma.user.create({
      data: {
        firstname,
        lastname: name,
        email,
        date,
        gender,
        encryptedPassword: hashPassword(password),
      }
    })

    const payload = { email }
    dotenv.config()
    const token = jwt.sign(payload, process.env.JWT_ENCRYPTION)

    res.json({ data: { user, token } })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})


api.post('/signin', async(req, res) => {

  const login = passport.authenticate('local', { session: false }, (err, user) => {
    console.log("🚀 ~ file: auth.js ~ line 55 ~ login ~ err", err)
    if (err) {
      return res.status(400).json({ error: err })
    }

    const { email } = user
    const payload = { email }
    dotenv.config()
    const token = jwt.sign(payload, process.env.JWT_ENCRYPTION)
    res.json({ data: { user, token } })
  })

  login(req, res)
})



export default api