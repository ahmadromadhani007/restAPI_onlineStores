const express = require('express');
const router = express.Router();
const database = require('../../config/database');
const validasi_data = require('./validasi_users_data');
const verifikasi_validasi_data = require('../../middleware/verifikasi_validasi_data');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const verifikasi_token = require('../../middleware/verifikasi_token');

router.get('/user',  async(req, res) => {
    try {
        const result = await database.raw(`SELECT user.*, provinsi.nama_provinsi,kabupaten.nama_kabupaten,kecamatan.nama_kecamatan,desa.nama_desa FROM user
        LEFT OUTER JOIN provinsi on provinsi.id_provinsi = user.id_provinsi
        LEFT OUTER JOIN kabupaten on kabupaten.id_kabupaten = user.id_kabupaten
        LEFT OUTER JOIN kecamatan on kecamatan.id_kecamatan = user.id_kecamatan
        LEFT OUTER JOIN desa on desa.id_desa = user.id_desa`);
        const hasil_data = result[0];
        if (hasil_data.length > 0) {
            res.status(200).json({
                status: 1,
                message: 'Success',
                result : hasil_data 
            });
            // var data_array = [];
            // hasil_data.forEach(async row => {
            //     var array_x = {};
            //     array_x['id_user'] = row.id_user
            //     array_x['nama'] = row.nama
            //     array_x['nama_provinsi'] = row.nama_provinsi
            //     array_x['nama_kabupaten'] = row.nama_kabupaten
            //     array_x['nama_kecamatan'] = row.nama_kecamatan
            //     array_x['nama_desa'] = row.nama_desa
            //     array_x['alamat'] = row.alamat
            //     array_x['telepon'] = row.telepon
            //     array_x['email'] = row.email
                
            //     data_array.push(array_x);
            //     return res.status(200).json({
            //         status: 1,
            //         message: 'Success',
            //         result : data_array
            //     });
            // });
            
        } else {
            return res.status(400).json({
                status: 0,
                message: 'Data Not Found'
            });
        }

    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        });

    } 
}); 

router.get('/user/profil/:id_user',  async(req, res) => {
    try {
        const result = await database.raw(`SELECT user.*, provinsi.nama_provinsi,kabupaten.nama_kabupaten,kecamatan.nama_kecamatan,desa.nama_desa FROM user
        LEFT OUTER JOIN provinsi on provinsi.id_provinsi = user.id_provinsi
        LEFT OUTER JOIN kabupaten on kabupaten.id_kabupaten = user.id_kabupaten
        LEFT OUTER JOIN kecamatan on kecamatan.id_kecamatan = user.id_kecamatan
        LEFT OUTER JOIN desa on desa.id_desa = user.id_desa
        WHERE user.id_user = '${req.params.id_user}'`);
        const hasil_data = result[0][0]
        if (hasil_data) {
        return res.status(200).json({
            status: 1,
            message: 'Success',
            result : hasil_data
        });

    }else{
        return res.status(400).json({
            status: 0,
            message: 'Data Not Found'
        });
    
    }

    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        });

    } 
});

router.post('/user/daftar', validasi_data.daftar, verifikasi_validasi_data, async(req, res) => {
    const data = req.body;
    try {
        const isTelepon = await database('user').select('*').where('telepon', data.telepon).first();
        if (isTelepon) {
            return res.status(400).json({
                status: 0,
                message: "Telepon has been used",
                result: isTelepon
            });
        }
        const isEmail = await database('user').select('*').where('email', data.email).first();
        if (isEmail) {
            return res.status(400).json({
                status: 0,
                message: "Email has been used",
                result: isEmail
            });
        }

        const createUser = {
            ...data,
            password: bcrypt.hashSync(data.password, 14)
        }
        const simpan = await database('user').insert(createUser);
        return res.status(201).json({
            status: 1,
            message: "Success",
            result : {
                id_user: simpan[0],
                ...createUser
            }
        })

    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        });

    } 
});

router.post('/user/login', validasi_data.login, verifikasi_validasi_data, async(req, res) => {
    const data = req.body;
    const random = Math.floor(Math.random() * (999999 - 100000 + 1) + (1000000));
    try {  
        const login = await database('user').where('email',data.email).first();
        if (login) {
            if(bcrypt.compareSync(data.password,login.password)) {  
                await database ('user').update('verifikasi_code', random).where('email', data.email);
                return res.status(200).json({
                    status: 1,
                    message: "Welcome User"
                })
            }else {
                return res.status(401).json({
                    status: 0,
                    message: "Password is wrong"
                }); 
            }
        } else {
            return res.status(400).json({
                status: 0,
                message: "Email is not valid"
            });
        }

    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        });

    } 
});

router.post('/user/verifikasi/kode',  async(req, res) => {
    try {
        const result = await database.raw(`SELECT user.*, provinsi.nama_provinsi,kabupaten.nama_kabupaten,kecamatan.nama_kecamatan,desa.nama_desa FROM user
        LEFT OUTER JOIN provinsi on provinsi.id_provinsi = user.id_provinsi
        LEFT OUTER JOIN kabupaten on kabupaten.id_kabupaten = user.id_kabupaten
        LEFT OUTER JOIN kecamatan on kecamatan.id_kecamatan = user.id_kecamatan
        LEFT OUTER JOIN desa on desa.id_desa = user.id_desa
        WHERE user.verifikasi_code = '${req.body.verifikasi_code}'`);
        const hasil_data = result[0][0]
        if (hasil_data) {
                var array_data = {};
                array_data['id_user'] = hasil_data.id_user
                array_data['nama'] = hasil_data.nama
                array_data['nama_provinsi'] = hasil_data.nama_provinsi
                array_data['nama_kabupaten'] = hasil_data.nama_kabupaten
                array_data['nama_kecamatan'] = hasil_data.nama_kecamatan
                array_data['nama_desa'] = hasil_data.nama_desa
                array_data['alamat'] = hasil_data.alamat
                array_data['telepon'] = hasil_data.telepon
                array_data['email'] = hasil_data.email

            const access_token = jwt.sign({array_data}, 
                "JWT HAS BEEN SUCCESSFULLY GENERATED",{   expiresIn : '1h'});
            
            const refresh_token = jwt.sign({array_data}, 
                "JWT HAS BEEN SUCCESSFULLY GENERATED",{   expiresIn : '7d'});
            await database('user').update('refresh_token', refresh_token).where('id_user', hasil_data.id_user);
            
            res.cookie('refresh_token', refresh_token, {
                httpOnly : true
            })
                return res.status(200).json({
                status: 1,
                message: "Welcome User",
                result: array_data,
                token : access_token
            })
    }else{
        return res.status(400).json({
            status: 0,
            message: 'Data Not Found'
        });
    
    }
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        });

    } 
});

router.post('user/verifikasi/email',  async(req, res) => {
    const data = req.body;
    const random = Math.floor(Math.random() * (999999 - 100000 + 1) + 1000000);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'dan10kiy@gmail.com',
            pass: 'Sysadmin321'
        }
    });
    try {  
       const email = await database('user').where('email', data.email).first();
       if (email) {
           var mailOptions = {
                from : 'dan10kiy@gmail.com',
                to : email.email,
                subject : 'Verifikasi Kode',
                text : 'Kode Verifikasi : ' + random
            };
            transporter.sendMail(mailOptions, async (err, info) => {
                if (err) {
                    return res.status(401).json({
                        status: 0,
                        message: "Email is does not have any verification",
                        result : err
                    })
                } else {
                    await database('user').update('verifikasi_code', random).where('email', data.email);
                    return res.status(200).json({
                        status: 1,
                        message: "Email has been sent",
                        result : info
                    })
                }
            })
       } else {
           return res.status(400).json({
                status: 0,
                message: "Email is undefined"   
            });
       }
        
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        });

    } 
});

router.put('/user/profil/ganti_password/:id_user',  async(req, res) => {
    const data = req.body;
    try {
        const kode = await database('user').where('id_user', req.params.id_user).first ();
        if (kode) {
            if (data.BaruPassword === data.VerifikasiPassword) {
                await database('user').update('password', bcrypt.hashSync(data.VerifikasiPassword, 14)).where('id_user', req.params.id_user);
                return res.status(200).json({
                    status: 1,
                    message: "Password successfully changed"
                });
            } else {
                return res.status(403).json({
                    status: 0,
                    message: "Password is not match"
                });
            }
        } else {
            return res.status(400).json({
                status: 0,
                message: "Data not found"
            });
        }

    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        });

    } 
});

router.put('/user/profil/edit/:id_user', validasi_data.edit, verifikasi_validasi_data, async(req, res) => {
    const data = req.body;
    try {
        const result = await database('user').where('id_user', req.params.id_user).first();
        if (result) {
            await database('user').update(data).where('id_user', req.params.id_user);
            return res.status(200).json({
                status: 1,
                message: "Success",
            })  
        }else {
            return res.status(400).json({
                status: 0,
                message: "Data not found",
            })
        }

} catch (error) {
        return res.status(500).json({
            status:0,
            message: error.message
        })
    }
});

router.put('/user/lupa_password/:verifikasi_code',  async(req, res) => {
    const data = req.body;
    try {
        const kode = await database('user').where('verifikasi_code', req.params.verifikasi_code).first ();
        if (kode) {
            if (data.BaruPassword === data.VerifikasiPassword) {
                await database('user').update('password', bcrypt.hashSync(data.VerifikasiPassword, 14)).where('id_user', kode.id_user);
                return res.status(200).json({
                    status: 1,
                    message: "Password has been changed"
                });
            } else {
                return res.status(403).json({
                    status: 0,
                    message: "Password is not match"
                });
            }
        } else {
            return res.status(400).json({
                status: 0,
                message: "Data not found"
            });
        }

    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        });

    } 
});

router.get('/user/refresh_token',  async(req, res) => {
    try {
        const token = req.cookies.refresh_token;
        if (!token) {
            return res.status(401).json({
                status: 0,
                message: 'Token unauthorized'
            });
        }
        const result = await database.raw(`SELECT user.*, provinsi.nama_provinsi,kabupaten.nama_kabupaten,kecamatan.nama_kecamatan,desa.nama_desa FROM user
        LEFT OUTER JOIN provinsi on provinsi.id_provinsi = user.id_provinsi
        LEFT OUTER JOIN kabupaten on kabupaten.id_kabupaten = user.id_kabupaten
        LEFT OUTER JOIN kecamatan on kecamatan.id_kecamatan = user.id_kecamatan
        LEFT OUTER JOIN desa on desa.id_desa = user.id_desa
        WHERE user.refresh_token = '${token}'`);
        const cek_token = result[0][0]
        if (cek_token) {
            jwt.verify(token, "JWT HAS BEEN SUCCESSFULLY GENERATED", async (err, decoded) => {
                if (err) {
                    return res.status(400).json({
                        status: 0,
                        message: 'Token invalid',
                        error : err.message
                    })
                }
                var array_data = {};
                array_data['id_user'] = cek_token.id_user
                array_data['nama'] = cek_token.nama
                array_data['nama_provinsi'] = cek_token.nama_provinsi
                array_data['nama_kabupaten'] = cek_token.nama_kabupaten
                array_data['nama_kecamatan'] = cek_token.nama_kecamatan
                array_data['nama_desa'] = cek_token.nama_desa
                array_data['alamat'] = cek_token.alamat
                array_data['telepon'] = cek_token.telepon
                array_data['email'] = cek_token.email

            const access_token = jwt.sign({array_data}, 
                "JWT HAS BEEN SUCCESSFULLY GENERATED",{   expiresIn : '1h'});
            
            const refresh_token = jwt.sign({array_data}, 
                "JWT HAS BEEN SUCCESSFULLY GENERATED",{   expiresIn : '7d'});
            await database('user').update('refresh_token', refresh_token).where('id_user', cek_token.id_user);
            
            res.cookie('refresh_token', refresh_token, {
                httpOnly : true
            })
                return res.status(200).json({
                status: 1,
                message: "Welcome User",
                result: array_data,
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