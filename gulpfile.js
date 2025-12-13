import path from 'path';
import fs from 'fs';
import { glob } from 'glob';
import { src, dest, watch, series } from 'gulp';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import terser from 'gulp-terser';
import sharp from 'sharp';
import plumber from 'gulp-plumber';

const sass = gulpSass(dartSass);

const paths = {
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js',
    images: 'src/img/**/*',
    sounds: 'src/sounds/**/*'  // ← NUEVO: agregar sonidos
};

export function css(done) {
    src(paths.scss, { sourcemaps: true })
        .pipe(plumber())
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(dest('./public/build/css', { sourcemaps: '.' }));
    done();
}

export function js(done) {
    src(paths.js)
        .pipe(plumber())
        .pipe(terser())
        .pipe(dest('./public/build/js'));
    done();
}

export async function imagenes(done) {
    const srcDir = './src/img';
    const buildDir = './public/build/img';
    const images = await glob(paths.images); 

    images.forEach(file => {
        if (fs.lstatSync(file).isDirectory()) return;

        const relativePath = path.relative(srcDir, path.dirname(file));
        const outputSubDir = path.join(buildDir, relativePath);
        procesarImagenes(file, outputSubDir);
    });
    done();
}

// NUEVA FUNCIÓN: Copiar sonidos
export async function sonidos(done) {
    const srcDir = './src/sounds';
    const buildDir = './public/build/sounds';
    
    // Crear directorio si no existe
    if (!fs.existsSync(buildDir)) {
        fs.mkdirSync(buildDir, { recursive: true });
    }
    
    const archivosSonido = await glob(paths.sounds);
    
    archivosSonido.forEach(file => {
        if (fs.lstatSync(file).isDirectory()) return;
        
        const nombreArchivo = path.basename(file);
        const archivoDestino = path.join(buildDir, nombreArchivo);
        

        fs.copyFileSync(file, archivoDestino);
    });
    
    done();
}

function procesarImagenes(file, outputSubDir) {
    if (!fs.existsSync(outputSubDir)) {
        fs.mkdirSync(outputSubDir, { recursive: true });
    }
    const baseName = path.basename(file, path.extname(file));
    const extName = path.extname(file);
    const videoExtensions = ['.mp4', '.webm', '.ogg']; 

    if (extName.toLowerCase() === '.svg' || videoExtensions.includes(extName.toLowerCase())) {
        const outputFile = path.join(outputSubDir, `${baseName}${extName}`);
        fs.copyFileSync(file, outputFile);
    } else {
        const outputFile = path.join(outputSubDir, `${baseName}${extName}`);
        const outputFileWebp = path.join(outputSubDir, `${baseName}.webp`);
        const outputFileAvif = path.join(outputSubDir, `${baseName}.avif`);
        const options = { quality: 80 };

        sharp(file).jpeg(options).toFile(outputFile);
        sharp(file).webp(options).toFile(outputFileWebp);
        sharp(file).avif().toFile(outputFileAvif);
    }
}

export function dev() {
    watch(paths.scss, css);
    watch(paths.js, js);
    watch(paths.images, imagenes);
    watch(paths.sounds, sonidos);  // ← NUEVO: observar cambios en sonidos
}

// TAREAS ACTUALIZADAS:

// ✅ Build normal (sin watch) - para npm run build
export const build = series(js, css, imagenes, sonidos);  // ← Agregar sonidos

// ✅ Desarrollo con watch - para npm run watch  
export const desarrollo = series(js, css, imagenes, sonidos, dev);  // ← Agregar sonidos

// ✅ Tarea por defecto - solo build (sin watch)
export default build;