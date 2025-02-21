

const getUsuarios = async (req, res) => {
    res.json({
        msg: "getUsuarios",
    });
}

const postUsuario = async (req, res) => {
    res.json({
        msg: "postUsuario",
    });
}

const putUsuario = async (req, res) => {
    res.json({
        msg: "putUsuario",
    });
}

const deleteUsuario = async (req, res) => {
    res.json({
        msg: "deleteUsuario",
    });
}

module.exports = {
    getUsuarios,
    postUsuario,
    putUsuario,
    deleteUsuario
}