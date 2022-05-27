const express = require('express');
const router = express.Router();
const database = require('../../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifikasi_token = require('../../middleware/verifikasi_token');

router.get('/admin/all', verifikasi_token, async(req, res) => {
    try {
        const result = await database.select('*').from('admin');
        if (result.length > 0){
            return res.status(200).json({
                status: 1,
                message: "Success",
                data: result
        })
    } else {
        return res.status(400).json({
            status: 0,
            message: "Data not found",
        })
    } 

    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        });
    }
});

router.get('/admin/one/:id_admin', async(req, res) => {
    try {
        const result = await database("admin").select('*').where('id_admin', req.params.id_admin).first();
        if (result) {
            return res.status(200).json({
                status: 1,
                message: "Success",
                result : result
            })
        } else { 
            return res.status(400).json({
                status: 0,
                message: "Data not found",
            })
        }

    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        });
    }
});

router.post('/admin/daftar', async(req, res) => {
    const data = req.body;
    try {
        const username = await database('admin').where('username', data.username).first();
        if (username) {
            return res.status(400).json({
                status: 0,
                message: "Username has been used" 
            })
        } else {
            const create = {
                username : data.username,
                password : bcrypt.hashSync(data.password, 12)
            }
            const simpan = await database('admin').insert(create);
            return res.status(200).json({
                status: 1,
                message: "Success",
                result : {
                    id_admin : simpan[0],
                    ...create
                }
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        });
    }
});

router.post('/admin/login', async(req, res) => {
    const data = req.body;
    try {
        const login = await database('admin').where('username', data.username).first();
        if (login) {
            if (bcrypt.compareSync(data.password, login.password)) {
            
                const access_token = jwt.sign({id_admin : login.id_admin}, 
                    "JWT HAS BEEN SUCCESSFULLY GENERATED",{   expiresIn : '1h'});
                
                const refresh_token = jwt.sign({id_admin : login.id_admin}, 
                    "JWT HAS BEEN SUCCESSFULLY GENERATED",{   expiresIn : '7d'});
                await database('admin').update('refresh_token', refresh_token).where('id_admin', login.id_admin);
                
                res.cookie('refresh_token', refresh_token, {
                    httpOnly : true
                })
                    return res.status(200).json({
                    status: 1,
                    message: "Welcome Admin",
                    token : access_token
                })
            } else {
                return res.status(400).json({
                    status: 0,
                    message: "Password is wrong"
                })
            }
        } else {
            return res.status(403).json({
                status: 0,
                message: "Username is undefined"
            })
        }

    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        });
    }
})

router.put('/edit/password/:id_admin', async(req, res) => {
    try {
        const result = await database('admin').where('id_admin', req.params.id_admin).first();
        if (result) {
            if (req.body.password_1 == req.body.password_2) {
                const newPassword = bcrypt.hashSync(req.body.password_2, 12);
                await database ('admin').update('password', newPassword).where('id_admin', req.params.id_admin);
                return res.status(200).json({
                    status: 1,
                    message: "Success"
                })

            } else {
                return res.status(400).json({
                    status: 0,
                    message: "Password is not same"
                })
            }
        } else {
            return res.status(400).json({
                status: 0,
                message: "Data not found"
            })
        }

    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        });
    }
});

router.delete('/admin/delete/:id_admin', async(req, res) => {
    try {
        const result = await database ('admin').where('id_admin', req.params.id_admin).first();
        if (result) {
            await database ('admin').where('id_admin', req.params.id_admin).delete();
            return res.status(200).json({
                status: 1,
                message: "Success"
            })
        } else {
            return res.status(400).json({
                status: 0,
                message: "Data not found"
            })
        }

    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        });
    }
});

router.get('/admin/refresh_token', async(req, res) => {
    try {
        const token = req.cookies.refresh_token;
        if (!token) {
            return res.status(401).json({
                status: 0,
                message: 'Token unauthorized'
            });
        }
        const cek_token = await database('admin').where('refresh_token', token).first();

        if (cek_token) {
            jwt.verify(token, "JWT HAS BEEN SUCCESSFULLY GENERATED", async (err, decoded) => {
                if (err) {
                    return res.status(400).json({
                        status: 0,
                        message: 'Token invalid',
                        error : err.message
                    })
                }
                const access_token = jwt.sign({id_admin : decoded.id_admin}, 
                    "JWT HAS BEEN SUCCESSFULLY GENERATED",{   expiresIn : '1h'});
                
                const refresh_token = jwt.sign({id_admin : decoded.id_admin}, 
                    "JWT HAS BEEN SUCCESSFULLY GENERATED",{   expiresIn : '7d'});
                await database('admin').update('refresh_token', refresh_token).where('id_admin', decoded.id_admin);
                
                res.cookie('refresh_token', refresh_token, {
                    httpOnly : true
                })
                    return res.status(200).json({
                    status: 1,
                    message: "New token generated",
                    token : access_token
                })
            });
        } else {
            return res.status(400).json({
                status: 0,
                message: 'No token detected'
            });
        }

    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        });
    }
});

module.exports = router;