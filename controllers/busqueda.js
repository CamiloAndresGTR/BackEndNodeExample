const { response } = require("express");
const { ObjectId } = require("mongoose").Types;
const { Usuario, Producto, Categoria } = require("../models");

const coleccionesPermitidas = ["usuarios", "categorias", "productos", "roles"];

const buscarUsuarios = async (termino = "", res = response) => {
  const esMongoID = ObjectId.isValid(termino); //TRUE
  if (esMongoID) {
    const usuario = await Usuario.findById(termino);
    return res.json({
      Results: usuario ? [usuario] : [],
    });
  }
  const regexp = new RegExp(termino, "i");
  
  const query = {
    $or: [
      { nombres: regexp },
      { apellidos: regexp },
      { documento: regexp },
      { correo: regexp },
    ],
    $and: [{estado:true}]
  };
  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query),
  ]);
  
  res.json({
    total,
    usuarios
  });
};

const buscarProductos =  async (termino = "", res = response) => {
    const esMongoID = ObjectId.isValid(termino); //TRUE
    if (esMongoID) {
      const producto = await Producto.findById(termino);
      return res.json({
        Results: producto ? [producto] : [],
      });
    }
    const regexp = new RegExp(termino, "i");
    
    const query = {
      $or: [
        { nombre: regexp },
      ],
      $and: [{estado:true}]
    };
   
    const [total, productos] = await Promise.all([
      (Producto.countDocuments(query)),
      (await Producto.find(query)
                    .populate('usuario', 'correo')
                    .populate('categoria', 'nombre')),
    ]);
    
    res.json({
      total,
      productos
    });
  };

  const buscarCategorias =  async (termino = "", res = response) => {
    const esMongoID = ObjectId.isValid(termino); //TRUE
    if (esMongoID) {
      const categoria = await Categoria.findById(termino);
      return res.json({
        Results: categoria ? [categoria] : [],
      });
    }
    const regexp = new RegExp(termino, "i");
    
    const query = {
      $or: [
        { nombre: regexp },
      ],
      $and: [{estado:true}]
    };
  
    const [total, categorias] = await Promise.all([
        (Categoria.countDocuments(query)),
        (await Categoria.find(query)
                        .populate('usuario', 'correo')),
    ]);
    
    res.json({
      total,
      categorias
    });
  };


const buscar = (req, res = response) => {
  const { coleccion, termino } = req.params;
  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`,
    });
  }

  switch (coleccion) {
    case "usuarios":
        buscarUsuarios(termino, res);
      break;
    case "categorias":
        buscarCategorias(termino, res);
      break;
    case "productos":
        buscarProductos(termino, res);
      break;

    default:
      res.status(500).json({
        msg: "Falta implementar busqueda",
      });
  }
};

module.exports = {
  buscar,
};
