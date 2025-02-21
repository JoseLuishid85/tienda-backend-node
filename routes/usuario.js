const express = require('express');
const router = express.Router();
//const clienteController = require('../controllers/clienteController');

router.get('/', (req, res) => {
        res.json({
            msg: "Get",
        });
    }
);
router.post('/', (req, res) => {
        res.json({
            msg: "Post",
        });
    }
);

router.put('/', (req, res) => {
    res.json({
        msg: "Put",
    });
});
router.delete('/', (req, res) => {
    res.json({
        msg: "Delete",
    });
});

module.exports = router;