import { db } from '../db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = (req, res) => {
  //Check exsiting user

  const q = 'SELECT * FROM users WHERE email = ? OR username = ?'

  db.query(q, [req.body.email, req.body.username], async (error, data) => {
    if (error) return res.status(400).json(error)
    if (data.length) return res.status(409).jsob('user already exists')
    //hash password and create user

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(req.body.password, salt)

    const q = 'INSERT INTO users(`username`,`email`,`password`) VALUES (?)'
    const values = [req.body.username, req.body.email, hash]

    db.query(q, [values], (error, data) => {
      if (error) return res.status(400).json(error)
      return res.status(200).json('user has been created')
    })
  })
}
export const login = (req, res) => {
  //chevk user
  const q = 'SELECT * FROM users WHERE username = ?'

  db.query(q, [req.body.username], async (error, data) => {
    if (error) return res.json(error)
    if (data.length == 0) return res.status(404).json('User do not exists')

    //check password
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      data[0].password
    )
    if (!isPasswordCorrect)
      return res.status(400).json('Invalid username or password')
    const token = jwt.sign({ id: data[0].id }, 'jwtkey')

    const { password, ...other } = data[0]

    res
      .cookie('access_token', token, {
        httpOnly: false,
      })
      .status(200)
      .json(other)
  })
}
export const logout = (req, res) => {
  res
    .clearCookie('access_token', {
      sameSite: 'none',
      secure: true,
    })
    .status(200)
    .json('User has been loggedout')
}
