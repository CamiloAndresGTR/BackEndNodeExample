const { response } = require("express");
const { Producto } = require("../models");

//obtenerProductos - paginado - total - populate
const obtenerProductos = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };
  
    const [total, productos] = await Promise.all([
      Producto.countDocuments(query),
      Producto.find(query)
                .populate('usuario', 'correo')
                .populate('categoria', 'nombre')
                .skip(Number(desde))
                .limit(Number(limite)),
    ]);
    res.json({
      total,
      productos,
    });
  };

//obtenerProducto - populate {}

const obtenerProducto = async (req = request, res = response) => {
    
    const {id} = req.params;
  const producto =await  Producto.findById(id)
                                     .populate('usuario', 'correo')
                                     .populate('categoria', 'nombre');
    
    res.json(producto);
  };


const crearProducto = async (req, res= response) =>{

    const {estado, usuario,...body} = req.body;
    const nombre = req.body.nombre.toUpperCase();
    const productoDb = await Producto.findOne({nombre});
    if (productoDb) {
        return res.status(400).json({
            msg: `El producto: ${productoDb.nombre}, ya está registrada en la base de datos`

        });
    }

    //Generar la data a guardar   
    const data = {
        nombre,
        precio: req.body.precio,
        usuario: req.usuario._id,
        categoria: req.body.categoria,
        descripcion: req.body.descripcion
        
    }
    
    const producto = await Producto(data);
    producto.save();

    res.status(201).json(producto);
}

//actualizarProducto
const actualizarProducto = async (req, res = response) => {
    const { id } = req.params;
    const {estado, usuario, ...data} = req.body;
    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }
    
    data.usuario = req.usuario._id;
    const usuarioPut = await Producto.findByIdAndUpdate(id, data, {new:true});
    res.json(usuarioPut);
  };

//borrarProducto - lógico 
const borrarProducto = async (req, res = response) => {

    const {id} = req.params;
   
    const producto = await Producto.findByIdAndUpdate(id,{estado:false});
    const usuarioAutenticado = req.usuario;
  
    res.json({producto, usuarioAutenticado});
  };


module.exports= {
     obtenerProductos,
     crearProducto,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}