const express = require('express');
const router = express.Router();
const database = require('../config/database');

router.get('/provinsi', async(req, res) => {
    try {
        const result = await database("provinsi").select("*");
        return res.status(200).json({
            status: 1,
            message: "Success",
            result: result
        })
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        });
    }
});

router.get('/kabupaten/:id_provinsi', async(req, res) => {
    try {
        const result = await database.select('*').from("kabupaten").where(
            "id_provinsi", req.params.id_provinsi
        );
        if (result.length > 0) {
            return res.status(200).json({
                status: 1,
                message: "Success",
                result: result
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

router.get('/kecamatan/:id_kabupaten', async(req, res) => {
    try {
        const result = await database.select('*').from("kecamatan").where(
            "id_kabupaten", req.params.id_kabupaten
        );
        if (result.length > 0) {
            return res.status(200).json({
                status: 1,
                message: "Success",
                result: result
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

router.get('/desa/:id_kecamatan', async(req, res) => {
    try {
        const result = await database.select('*').from("desa").where(
            "id_kecamatan", req.params.id_kecamatan
        );
        if (result.length > 0) {
            return res.status(200).json({
                status: 1,
                message: "Success",
                result: result
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

module.exports = router;