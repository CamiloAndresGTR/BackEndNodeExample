const { Router } = require("express");
const { check } = require("express-validator");


const {
    validarCampos,
    validateJWT,
    tieneRole,
    esADminRole,
  } = require("../middlewares");
  
  const {
    esRoleValido,
    correoExiste,
    usuarioPorIdExiste,
  } = require("../helpers/db-validators");
const { crearCategoria } = require("../controllers/categorias");


  
const router = Router();
//Obtener todas las categorias - publico
router.get(
    "/",(req, res) =>{
        console.log('get Categorias');
        res.json({msg:'Todo OK'})
    }
  );

  // Obtener una categoria por id - Publico
  router.get(
    "/:id",(req, res) =>{
        console.log('get Categorias');
        res.json({msg:'Todo OK Id'})
    }
  );

//Crear categoría - privado
  router.post(
    "/",
    [validateJWT,
    check('nombre','El nombre es requerido').not().isEmpty(),
    //check('usuario','El usuario es obligatorio').not().isEmpty(),
    validarCampos

    ],
    crearCategoria
  );

  //Actualizar una categoria - privado
  router.put(
    "/:id",(req, res) =>{
        console.log('get Categorias');
        res.json({msg:'Todo OK'})
    }
  );
//Delete lógico - privado - Admin
  router.delete(
    "/:id",(req, res) =>{
        console.log('get Categorias');
        res.json({msg:'Todo OK'})
    }
  );

  
  module.exports = router;