const { response } = require("express");
const { Categoria } = require("../models");


const crearCategoria = async (req, res= response) =>{

    const nombre = req.body.nombre.toUpperCase();
    const categoriaDb = await Categoria.findOne({nombre});
    if (categoriaDb) {
        return res.status(400).json({
            msg: `La Categoría: ${categoriaDb.nombre}, ya está registrada en la base de datos`

        });
    }

    //Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }
    const categoria = await Categoria(data);
    categoria.save();

    res.status(201).json(categoria);
}


module.exports= {
    crearCategoria
}