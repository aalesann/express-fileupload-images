const express = require('express');
const fileupload = require('express-fileupload');
const morgan = require('morgan');
const path = require('path');

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(morgan('dev'));
app.use(express.json());;
app.use(express.urlencoded({ extended:false, limit:'10mb'}))
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileupload());

// Envía la página que contiene el formulario de subida de imágenes.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
})

// Recibe una imagen
app.post('/upload', (req, res) => {
    // return console.log(req.files); // the uploaded file object

    // El objeto req.files contiene la información de la imaen, se establece la ubicación don
    // Se almacenará la misma con el método mv.
    req.files.foo.mv(path.join(__dirname, `public/img/${req.files.foo.name}`), (error) => {
        if (error) {
            console.log(error)
            return res.status(400).json({
                msg: 'No se pudo subir la imagen'
            });
        }


        // res.json('La imagen se ha subido con éxito');
        console.log('La imagen se ha subido con éxito');

        // Si la imagen fue subida correctamente se redirecciona nuevamente
        // a la ruta que devuelve la página del formulario.
        res.redirect('/')
    });
    
});

// Recibe múltiples archivos - el atributo name debe ser "img"
app.post('/upload/multiple', (req, res) => {
    // console.log(req.files)
    const { img } = req.files;

    // Se mueven todas las imágenes recibidas a la carpeta pública
    // Crear la carpeta img si es que no existe
    img.forEach( (image, i) => {
        image.mv(path.join(__dirname, `public/img/${image.name}`), (error) => {
            if (error) {
                console.log(error)
                return res.status(400).json({
                    msg: 'No se pudo subir la imagen'
                });
            }    
        });
    });
    
    res.json({
        msg: 'Imagenes subidas correctamente',
        img
    });
    
});

app.listen(app.get('port'), () => console.log(`Server on port ${app.get('port')}`));