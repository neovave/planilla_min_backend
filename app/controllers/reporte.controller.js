
const { response, request } = require('express');
const { Op, BOOLEAN,  } = require("sequelize");
const { Salario_planilla, Municipio ,Organismo, Reparticion, Asignacion_cargo_empleado, Tipo_descuento_sancion, sequelize, Sequelize} = require('../database/config');
const paginate = require('../helpers/paginate');
const moment = require('moment');
//const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const db = require('../database/config');


const pdfMake = require('pdfmake/build/pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');


pdfMake.vfs = pdfFonts.pdfMake.vfs; // Cargar las fuentes


// const getAportePaginate = async (req = request, res = response) => {
//     try {
//         const {query, page, limit, type, status, activo, id} = req.query;
//         const optionsDb = {
//             attributes: { exclude: ['createdAt'] },
//             order: [['id', 'ASC']],
//             where: { 
//                 [Op.and]: [ 
//                     { activo },  id?{id}:{}
//                 ],
//             },
//             // include: [
//             //     { association: 'Aporte_Aporteempleado',  attributes: {exclude: ['createdAt']},  
//             //         where: {
//             //             [Op.and]:[
//             //                 { activo } ,
                            
//             //             ]
//             //         }
//             //     },
//             // ],
//         };
//         let aportes = await paginate(Aporte, page, limit, type, query, optionsDb); 
//         return res.status(200).json({
//             ok: true,
//             aportes
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             ok: false,
//             errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
//         });
//     }
// }

// const newRepPlanilla = async (req = request, res = response ) => {

//     try {
//         const { body } = req.body;

//         // Crear un nuevo documento PDF
//         const pdfDoc = await PDFDocument.create();
        
//         // Definir la fuente estándar
//         const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
        
//         // Crear una página en formato horizontal  21.6 * 72, 33.0 * 72
//         const page = pdfDoc.addPage([ 12.9 *72, 8.5 * 72 ]);///([841.89, 595.28]); // A4 Horizontal
//         const { width, height } = page.getSize();
        
//         // Estilo básico
//         const fontSize = 12;
//         let yPosition = height - 20; // Margen superior

//         //console.log("name File Tempo",nameFileTempo);
//         const nameFileTempo = 'planilla.pdf';//`${uuidv4()}.pdf`;
//         const outputFileName = 'public/upload/'+nameFileTempo;
        
//         // Agregar la primera cabecera
//         agregarCabecera(page, yPosition , timesRomanFont, height);
        
//         // Guardar el PDF generado
//         const pdfBytes = await pdfDoc.save();
//         fs.writeFileSync(outputFileName, pdfBytes);
//         //console.log('PDF generado con éxito');

//         //const aporteNew = await Reporte.create(body);
//         return res.status(201).json({
//             ok: true,
//             //aporteNew
//         });
//     } catch (error) {
//         console.log("error:",error);
//         return res.status(500).json({
//           ok: false,
//           errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
//         });
//     }
// }
// // Función para agregar la cabecera en la página actual
// function agregarCabecera(pagina, yPosition, timesRomanFont, height) {
//     const tableX = 50;
//     const tableY = height - 60;
//     const columnWidth = 150;
//     const rowHeight = 20;
//     const fontSize = 6;
//     // Título del reporte
//     pagina.drawText('DETALLE DESGLOSADO DE INGRESOS Y DESCUENTOS POR ITEM Y EMPLEADO', {
//         x: 350,
//         y: yPosition,
//         size: 11,
//         font: timesRomanFont,
//         color: rgb(0, 0, 0),
//     });
//     pagina.drawText('0020 MINISTERIO DE DEFENSA - 0020.01.001 Min.Defensa', {
//         x: 450,
//         y: yPosition-10,
//         size: 8,
//         font: timesRomanFont,
//         color: rgb(0, 0, 0),
//     });

    
//     // Dibujar las columnas de la tabla
//     pagina.drawText('Organismo Repartición Depto', {
//       x: tableX,
//       y: tableY,
//       size: fontSize,
//       font: timesRomanFont,
//       color: rgb(0, 0, 0),
//     });
//     pagina.drawText('Código', {
//       x: tableX + columnWidth,
//       y: tableY,
//       size: fontSize,
//       font: timesRomanFont,
//       color: rgb(0, 0, 0),
//     });
//     pagina.drawText('Doc. Id', {
//       x: tableX + columnWidth * 2,
//       y: tableY,
//       size: fontSize,
//       font: timesRomanFont,
//       color: rgb(0, 0, 0),
//     });
//     pagina.drawText('Nombre', {
//       x: tableX + columnWidth * 3,
//       y: tableY,
//       size: fontSize,
//       font: timesRomanFont,
//       color: rgb(0, 0, 0),
//     });
//     pagina.drawText('DT', {
//         x: tableX + columnWidth * 4,
//         y: tableY,
//         size: fontSize,
//         font: timesRomanFont,
//         color: rgb(0, 0, 0),
//       });

//     // Dibujar las líneas horizontales de la tabla
//     pagina.drawLine({
//       start: { x: tableX, y: tableY - 6 },
//       end: { x: tableX + columnWidth * 5, y: tableY - 6 },
//       thickness: 1,
//       color: rgb(0, 0, 0),
//     });
//     //return pagina;
// }


const newRepPlanilla = async (req = request, res = response ) => {

    try {
        const  body   = req.body;
        
        //console.log("body.........................+++++++++++++++++++++++++++:",body);
        const docDefinition = {
            pageSize: {
              
              width: 12.9 *72,
              height: 8.5 * 72
            },//'legal',
            pageMargins: [20, 30, 20, 20],
            pageOrientation: 'landscape', // Orientación horizontal
            content: [],
            styles: {
              header: {
                  fontSize: 10,
                  bold: true,
                  //margin: [0, 15, 0, 15]
              },
              titleheader: {
                fontSize: 7,
                bold: true,
                
                alignment: 'center'
                //margin: [0, 0, 0, 10]
              },
              totalPlanilla: {
                fontSize: 5,
                bold: true,
                
                alignment: 'right'
                //margin: [0, 0, 0, 10]
              },
              textheader: {
                fontSize: 7,
                bold: true,
                alignment: 'left'
              },
              subheaderT: {
                fontSize: 6,
                bold: true,
                alignment: 'left'
                
              },
              subheader: {
                fontSize: 6,
                bold: true,
              },
              tableExample: {
                margin: [0, 5, 0, 15]
              },
              tableplanilla: {
                fontSize: 5.5,
                alignment: 'right'
                //fillColor: 'blue',
                //fillOpacity: 0.3
              },
              tableOpacityExample: {
                margin: [0, 5, 0, 15],
                fillColor: 'blue',
                fillOpacity: 0.3
              },
              tableHeader: {
                bold: true,
                fontSize: 6,
                //color: 'black'
              }
            },
            defaultStyle: {
              // alignment: 'justify'
            },
            // defaultStyle: {
            //   font: 'Helvetica',
            // },
            
            header: function (currentPage, pageCount) {
              return [
                {
                      text: 'DETALLE DESGLOSADO DE INGRESOS Y DESCUENTOS POR ITEM Y EMPLEADO',
                      alignment: 'center',
                      fontSize: 10,
                      bold: true,
                      margin: [0, 10, 0, 0], // Márgenes [izquierda, arriba, derecha, abajo]   
                },
                {
                  text: '0020 MINISTERIO DE DEFENSA - 0020.01.001 Min.Defensa',
                      alignment: 'center',
                      fontSize: 6,
                      bold: true,
                      margin: [0, 0, 0, 0], // Márgenes [izquierda, arriba, derecha, abajo]
                },
        
              ];
            },
          
          };
        
        const listaEmpleados = await Municipio.findAll({
          include: [
            {
              model: Reparticion,
              as: 'municipio_reparticion', // Alias para la relación
              where: {
                id_organismo: body.id_organismo, //nombre:'CMDO.5TA.DIV.'
              },              
              include: [
                { association: 'reparticion_organismo' },
                {
                  model: Asignacion_cargo_empleado,
                  as: 'reparticion_asigCarEmp', // Alias para la relación
                  include: [
                    { association: 'asignacioncargoemp_empleado' },
                    { association: 'asignacioncargoemp_cargo' },
                    {
                      model: Salario_planilla,
                      as: 'asignacioncargoemp_salarioplanilla', // Alias para la relación
                      where: {
                        id_mes: body.id_mes
                      },
                      //limit:100
                    }

                  ],
                  limit:100
                }

              ],
              
            },
            
          ]
        });
        
        //console.log("name File Tempo",nameFileTempo);


    let mostrarCabecera=false;
          // Recorrer las regiones
    listaEmpleados.forEach((municipio) => {
    
      mostrarCabecera = true;

    // Recorrer los reparticion
    municipio.municipio_reparticion.forEach((reparticion) => {
      // Agregar título de departamento
      // docDefinition.content.push({
      //   text: `${reparticion.nombre}`,
      //   style: 'subheader',
      //   margin: [10, -10, 0, 5],
      // });

      const empleadosTable = {
        style: 'tableplanilla',
        table: {
          headerRows: 5,
          widths: [14, 20, 24, 110, 8,  10,18,  27,23,23,23,23,20,  24,22,20,20,20 ,105,  20,24,24,24,24],
          //heights: [50],
          //widths: [30, 25, 25, 120, 10  ], // Dos columnas de igual ancho
          body: [
            [
              {  colSpan: 24, alignment: 'left',border: [false, false, false, false],
                margin: [-5, 0, 0, 0],
                style: 'tableHeader',
                table: {
                  //headerRows: 2,
                  margin: [0, 0, 0, 0],
                  widths: [300, 300, 100, 110],
                  //heights: [20],
                  body: [
                    [{text:'Dirección Administrativa:',style:'titleheader',border: [false, false, false, false],},
                    {text:'Unidad Ejecutora:',style:'titleheader',border: [false, false, false, false],},
                    {text:'Coprobante:',style:'titleheader',border: [false, false, false, false],},
                    {text:'Devengado:',style:'titleheader',border: [false, false, false, false],}
                    ],
                    [{text:'Ministerio de defenza',style:'textheader'},
                    {text:'administracion central',style:'textheader'},
                    {text:'',style:'textheader'},
                    {text:'',style:'textheader'}
                    ],
                      
                  ]
                }

               },{},{},{},{},{},{},{},{},{},  {},{},{},{},{},{},{},{},{},{},  {},{},{},{}
            ],
            // Encabezados de la tabla
            [{text:'Organi Repart Dept',style:'subheaderT',border:[true,true,true,true]},
              {text:'Código', style:'subheaderT' ,border:[true,true,true,true]},
              {text:'Doc. Id',style:'subheaderT', border:[true,true,true,true]},
              {text:'Nombre',style:'subheaderT', border:[true,true,true,true]},
              {text:'DT',style:'subheaderT', border:[true,true,true,true]},
              
              {text:'Banco',style:'subheaderT', border:[true,true,true,true]},
              {text:'Fte Org',style:'subheaderT', border:[true,true,true,true]},

              {text:'Total Gando',style:'subheaderT', border:[true,true,true,true]},
              {text:'Haber Básico',style:'subheaderT', border:[true,true,true,true]},
              {text:'Bono Antiguedad',style:'subheaderT', border:[true,true,true,true]},
              {text:'Bono Frontera',style:'subheaderT', border:[true,true,true,true]},
              {text:'Bono Militares',style:'subheaderT', border:[true,true,true,true]},
              {text:'Otros Ingresos',style:'subheaderT', border:[true,true,true,true]},

              {text:'Renta de vejez',style:'subheaderT', border:[true,true,true,true]},
              {text:'Riesgo común',style:'subheaderT', border:[true,true,true,true]},
              {text:'Comisión',style:'subheaderT', border:[true,true,true,true]},
              {text:'Aporte Sol. Ase',style:'subheaderT', border:[true,true,true,true]},
              {text:'Aporte Nal. Sol',style:'subheaderT', border:[true,true,true,true]},

              {
                margin: [-5, -3, 0, -3],
                style: 'subheaderT',
                table: {
                  widths: [20,20,20,20],
                  //heights: 40,
                  body: [
                    [{ text: 'Patronales', colSpan: 4, alignment: 'center',border: [false, false, false, true] }, {}, {},{}],
                    [{ text: 'Riesgo Profes', border: [false, false, true, false] }, { text: 'Caja de Salud', border: [false, false, true, false] }  ,
                     { text: 'Ap Pat Vivienda', border: [false, false, true, false] }, { text: 'Ap Pat SOL', border: [false, false, false, false] } ],
                    
                  ]
                },
                border:[true,true,true,true]
              },

              {text:'Dscto Impsto',style:'subheaderT', border:[true,true,true,true]},
              {text:'Otros Dsctos',style:'subheaderT', border:[true,true,true,true]},
              {text:'Subsidio',style:'subheaderT', border:[true,true,true,true]},
              {text:'Liquido Pagable',style:'subheaderT', border:[true,true,true,true]},
              {text:'Liq. Pag Acum',style:'subheaderT', border:[true,true,true,true]},
            ],
            [
              { text: `${municipio.municipio_reparticion[0].reparticion_organismo.nombre}`, colSpan: 24, alignment: 'left',border: [false, false, false, false],  },{},{},{},{},{},{},{},{},{},  {},{},{},{},{},{},{},{},{},{},  {},{},{},{}
            ],
            [
              { text: `${municipio.nombre}`, colSpan: 24, alignment: 'left',border: [false, false, false, false], margin: [10, -5, 0, 0] },{},{},{},{},{},{},{},{},{},  {},{},{},{},{},{},{},{},{},{},  {},{},{},{}
            ],
            [
              { text: `${reparticion.nombre}`, colSpan: 24, alignment: 'left',border: [false, false, false, false], margin: [15, -5, 0, 0] },{},{},{},{},{},{},{},{},{},  {},{},{},{},{},{},{},{},{},{},  {},{},{},{}
            ]
            

          ],
        },
        layout: {
          defaultBorder: false,
        }
        //layout: 'lightHorizontalLines', // Estilo de la tabla
      };

      
        // Agregar título de región
      // docDefinition.content.push({
      //   text: `${municipio.municipio_reparticion[0].reparticion_organismo.nombre}`,
      //   style: 'subheader',
      //   margin: [0, 0, 0, 10], // Márgenes [izquierda, arriba, derecha, abajo]
      // });
    
      
      
      let totalGanado = 0;
      let totalHB = 0;
      let totalAntiguedad = 0;
      let totalFrontera = 0;
      let totalBonos = 0;
      let totalOtrosIngreso = 0;
      let totalVejez =0, totalRComun =0, totalComision =0, totalApSol =0;
      let totalApNalSol =0;
      let totalRProf =0, totalCSalud =0, totalApVivienda =0, totalApSolid =0;

      let totalIva =0;
      let totalDescuento = 0;
      let totalSubsidio = 0;
      let totalLPagable = 0;
      // Recorrer las empleado
      reparticion.reparticion_asigCarEmp.forEach((asigempleado) => {
        totalGanado += parseFloat( asigempleado.asignacioncargoemp_salarioplanilla[0].total_ganado);
        totalHB += parseFloat( asigempleado.asignacioncargoemp_salarioplanilla[0].asistencia[0].haber_basico);
        totalAntiguedad += parseFloat( asigempleado.asignacioncargoemp_salarioplanilla[0].antiguedad);
        let frontera = 0;
        let otrosIng = 0;
        let bonosIng = 0;
        asigempleado.asignacioncargoemp_salarioplanilla[0].bonos[0].bonos.forEach(( bonos) => {
          if (bonos.id_bono === 8) { //bono frontera
            //console.log('Color favorito encontrado:', preferences[key]);
            frontera = bonos.monto_bs;
          }else if(bonos.id_bono === 18 || bonos.id_bono === 19){ //bono 
              otrosIng += bonos.monto_bs;
          }else {
              bonosIng += bonos.monto_bs;
          }
        });
        //aporte laboral
        let vejez =0, rComun =0, comision =0, apSol =0;
        asigempleado.asignacioncargoemp_salarioplanilla[0].aporte_laboral_afp.forEach(( afp) => {
          if (afp.id_config_afp === 1) { //
            vejez = afp.monto_afp;
          }else if(afp.id_config_afp === 2 ){ //bono 
              rComun = afp.monto_afp;
          }else if(afp.id_config_afp === 3 ){
              comision = afp.monto_afp;
          }else if(afp.id_config_afp === 4 ){
              apSol = afp.monto_afp;
          }
        });
        totalVejez += vejez; 
        totalRComun +=rComun; 
        totalComision +=comision;
        totalApSol +=apSol;
        
        totalApNalSol +=  asigempleado.asignacioncargoemp_salarioplanilla[0].total_ap_solidario? parseFloat(asigempleado.asignacioncargoemp_salarioplanilla[0].total_ap_solidario):0;
        //aporte patronal
        let rProf =0, cSalud =0, apVivienda =0, apSolid =0;
        asigempleado.asignacioncargoemp_salarioplanilla[0].aporte_patronal.forEach(( afp) => {
          if (afp.id_escala_afp === 1) { //
            rProf = afp.monto;
          }else if(afp.id_escala_afp === 2 ){ //bono 
              apSolid = afp.monto;
          }else if(afp.id_escala_afp === 3 ){
              apVivienda = afp.monto;
          }else if(afp.id_escala_afp === 4 ){
              cSalud = afp.monto;
          }
        });
        totalRProf += parseFloat( rProf ); 
        totalApSolid +=parseFloat( apSolid ); 
        totalApVivienda +=parseFloat( apVivienda );
        totalCSalud += parseFloat(cSalud);
        
        //const numeroConPrecision = numeroOriginal.toPrecision(4); // "123.5"
        //console.log(numeroConPrecision);
        totalFrontera += parseFloat(frontera); 
        totalOtrosIngreso += parseFloat(otrosIng);
        totalBonos +=  parseFloat(bonosIng);
        totalIva +=  asigempleado.asignacioncargoemp_salarioplanilla[0].total_iva? parseFloat(asigempleado.asignacioncargoemp_salarioplanilla[0].total_iva):0;
        totalDescuento +=  asigempleado.asignacioncargoemp_salarioplanilla[0].total_descuento? parseFloat(asigempleado.asignacioncargoemp_salarioplanilla[0].total_descuento):0;
        totalSubsidio  += asigempleado.asignacioncargoemp_salarioplanilla[0].total_subsidio? parseFloat(asigempleado.asignacioncargoemp_salarioplanilla[0].total_subsidio):0;
        totalLPagable += asigempleado.asignacioncargoemp_salarioplanilla[0].liquido_pagable? parseFloat(asigempleado.asignacioncargoemp_salarioplanilla[0].liquido_pagable):0;
  

        empleadosTable.table.body.push([ {},
          //console.log(".............. asignacion:", asigempleado.asignacioncargoemp_empleado),
          asigempleado.asignacioncargoemp_empleado.cod_empleado,
          asigempleado.asignacioncargoemp_empleado.numero_documento,
          {text:asigempleado.asignacioncargoemp_cargo.abreviatura +' '+ asigempleado.asignacioncargoemp_empleado.nombre +' '+ asigempleado.asignacioncargoemp_empleado.otro_nombre +' '+ asigempleado.asignacioncargoemp_empleado.paterno +' '+ asigempleado.asignacioncargoemp_empleado.materno, alignment:'left'},
          parseInt (asigempleado.asignacioncargoemp_salarioplanilla[0].dias_trabajados),

          {},{text:'00 000'},

          asigempleado.asignacioncargoemp_salarioplanilla[0].total_ganado,
          asigempleado.asignacioncargoemp_salarioplanilla[0].asistencia[0].haber_basico,
          asigempleado.asignacioncargoemp_salarioplanilla[0].antiguedad,
          Number(frontera.toFixed(2)) ,
          Number(bonosIng.toFixed(2)),
          Number(otrosIng.toFixed(2)),

          Number(vejez.toFixed(2)),
          Number(rComun.toFixed(2)),
          Number(comision.toFixed(2)),
          Number(apSol.toFixed(2)),
          asigempleado.asignacioncargoemp_salarioplanilla[0].total_ap_solidario,
          {
            margin: [-5, -3, 0, -3],
            //style: 'subheaderT',
            table: {
              widths: [20,20,20,20],
              //heights: 40,
              body: [
                [
                  Number(rProf.toFixed(2)),
                  Number(cSalud.toFixed(2)),
                  Number(apVivienda.toFixed(2)),
                  Number(apSolid.toFixed(2))
                 ],
                
              ]
            },
            layout: 'noBorders'

          },
          asigempleado.asignacioncargoemp_salarioplanilla[0].total_iva,
          asigempleado.asignacioncargoemp_salarioplanilla[0].total_descuento,
          asigempleado.asignacioncargoemp_salarioplanilla[0].total_subsidio,
          asigempleado.asignacioncargoemp_salarioplanilla[0].liquido_pagable,
         {}
          


        ]);
        
      });

      docDefinition.content.push(empleadosTable);

      // Agregar fila de empleado
      empleadosTable.table.body.push([
        {},
        
        { text: 'TOTALES', colSpan: 6, style: 'totalPlanilla',border: [false, true, false, false] },  
        {},{},{},{},{},
        { text: Number(totalGanado.toFixed(2)), style: 'totalPlanilla',border: [false, true, false, false] },  
        { text: Number(totalHB.toFixed(2)), style: 'totalPlanilla',border: [false, true, false, false] },
        { text: Number(totalAntiguedad.toFixed(2)), style: 'totalPlanilla',border: [false, true, false, false] },  
        { text: Number(totalFrontera.toFixed(2)), style: 'totalPlanilla',border: [false, true, false, false] },  
        { text: Number(totalBonos.toFixed(2)), style: 'totalPlanilla',border: [false, true, false, false] },  
        { text: Number(totalOtrosIngreso.toFixed(2)), style: 'totalPlanilla',border: [false, true, false, false] },  
        { text: Number(totalVejez.toFixed(2)), style: 'totalPlanilla',border: [false, true, false, false] },    
        { text: Number(totalRComun.toFixed(2)), style: 'totalPlanilla',border: [false, true, false, false] },  
        { text: Number(totalComision.toFixed(2)), style: 'totalPlanilla',border: [false, true, false, false] },  
        { text: Number(totalApSol.toFixed(2)), style: 'totalPlanilla',border: [false, true, false, false] },  
        { text: Number(totalApNalSol.toFixed(2)), style: 'totalPlanilla',border: [false, true, false, false] },
        
        {
          margin: [-5, -3, 0, -3],
          //style: 'subheaderT',
          table: {
            widths: [20,20,20,20],
            //heights: 40,
            body: [
              [
                { text: Number(totalRProf.toFixed()), style: 'totalPlanilla',border: [false, true, false, false] },  
                { text: Number(totalCSalud.toFixed()), style: 'totalPlanilla',border: [false, true, false, false] },  
                { text: Number(totalApVivienda.toFixed()), style: 'totalPlanilla',border: [false, true, false, false] },  
                { text: Number(totalApSol.toFixed()), style: 'totalPlanilla',border: [false, true, false, false] },  
               ],
              
            ]
          },
          //layout: 'noBorders'

        },
        
        
        { text: Number(totalIva.toFixed()), style: 'totalPlanilla',border: [false, true, false, false] },  
        { text: Number(totalDescuento.toFixed()), style: 'totalPlanilla',border: [false, true, false, false] },  
        { text: Number(totalSubsidio.toFixed()), style: 'totalPlanilla',border: [false, true, false, false] },  
        { text: Number(totalLPagable.toFixed()), style: 'totalPlanilla',border: [false, true, false, false] },  
        {}
      ]);
    

      docDefinition.content.push({ text: '', pageBreak: 'after' });

    });
    mostrarCabecera= false;
  });
        
        // Guardar el PDF generado
        //const pdfBytes = await pdfDoc.save();
        //fs.writeFileSync(outputFileName, pdfBytes);
        //console.log('PDF generado con éxito');
        // Crear el PDF
        const pdfDoc = pdfMake.createPdf(docDefinition);
        const nameFile = 'planilla.pdf';//`${uuidv4()}.pdf`;
        const outputFileName = 'public/upload/'+nameFile;
        const filePath = path.join(__dirname, '../../public/upload/', nameFile);  // Ruta al archivo PDF en el servidor
        
        // Guardar el PDF en el sistema de archivos
        pdfDoc.getBuffer((buffer) => {
            fs.writeFileSync(outputFileName, buffer);
            //res.setHeader('Content-Type', 'application/pdf');
            //res.setHeader('Content-Disposition', 'attachment; filename=reporte_empleados.pdf');
            //res.send(buffer);
        });

        //const filePath = path.join(__dirname, '../../public/upload' , 'reporte_planilla.pdf' );  // Ruta al archivo PDF en el servidor
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="reporte_planilla.pdf"');
        
        // Enviar el archivo
        res.sendFile(filePath, (err) => {
          if (err) {
            console.log('Error al enviar el archivo:', err);
            res.status(500).send('Error al descargar el archivo.');
          }
        });

        //const aporteNew = await Reporte.create(body);
        // return res.status(201).json({
        //     ok: true,
        //     listaEmpleados
        //     //aporteNew
        // });
    } catch (error) {
        console.log("error:",error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newRepPlanillaImpositiva = async (req = request, res = response ) => {

  try {
      const  body   = req.body;
      
      const docDefinition = {
          pageSize: 'LEGAL',
          // {
          //   width: 12.9 *72,
          //   height: 8.5 * 72
          // },//'legal',
          pageMargins: [20, 30, 20, 20],
          //pageOrientation: 'landscape', // Orientación horizontal
          content: [],
          styles: {
            header: {
                fontSize: 10,
                bold: true,
                //margin: [0, 15, 0, 15]
            },
            titleheader: {
              fontSize: 7,
              bold: true,
              
              alignment: 'center'
              //margin: [0, 0, 0, 10]
            },
            totalPlanilla: {
              fontSize: 5,
              bold: true,
              
              alignment: 'right'
              //margin: [0, 0, 0, 10]
            },
            textheader: {
              fontSize: 7,
              bold: true,
              alignment: 'left'
            },
            subheaderT: {
              fontSize: 6,
              bold: true,
              alignment: 'left'
              
            },
            subheader: {
              fontSize: 6,
              bold: true,
            },
            tableExample: {
              margin: [0, 5, 0, 15]
            },
            tableplanilla: {
              fontSize: 5.5,
              alignment: 'right'
              //fillColor: 'blue',
              //fillOpacity: 0.3
            },
            tableOpacityExample: {
              margin: [0, 5, 0, 15],
              fillColor: 'blue',
              fillOpacity: 0.3
            },
            tableHeader: {
              bold: true,
              fontSize: 6,
              //color: 'black'
            }
          },
          defaultStyle: {
            // alignment: 'justify'
          },
          // defaultStyle: {
          //   font: 'Helvetica',
          // },
          
          header: function (currentPage, pageCount) {
            return [
              {
                    text: 'PLANILLA IMPOSITIVA',
                    alignment: 'center',
                    fontSize: 10,
                    bold: true,
                    margin: [0, 10, 0, 0], // Márgenes [izquierda, arriba, derecha, abajo]   
              },
              {
                text: '0020 MINISTERIO DE DEFENSA - 0020.01.001 Min.Defensa',
                    alignment: 'center',
                    fontSize: 6,
                    bold: true,
                    margin: [0, 0, 0, 0], // Márgenes [izquierda, arriba, derecha, abajo]
              },
      
            ];
          },
        
        };
      
      const listaEmpleados = await db.sequelize.query("SELECT org.codigo as codigo_organismo, org.nombre as nombre_organismo, rep.codigo as codigo_reparticion, rep.nombre as nombre_reparticion, car.descripcion, car.abreviatura ,emp.cod_empleado, emp.numero_documento, emp.nombre, emp.otro_nombre, emp.paterno, emp.materno, rp.total_saldo_mes_anterior , rp.saldo_rciva_dependiente, rp.total_actualizacion, rp.rciva_retenido, rp.importe_sujeto_impuesto ,rp.ingreso_neto_bs FROM organismos org INNER JOIN reparticiones rep ON rep.id_organismo = org.id INNER JOIN asignacion_cargo_empleados ace ON ace.id_reparticion = rep.id INNER JOIN cargos car ON car.id = ace.id_cargo INNER JOIN empleados emp ON emp.id = ace.id_empleado INNER JOIN rciva_planillas rp ON rp.id_empleado = emp.id WHERE rep.id_organismo = :idOrganismo AND rp.id_mes = :idMes; ", 
        {   type: Sequelize.QueryTypes.SELECT, 
            replacements: {idOrganismo: body.id_organismo, idMes: body.id_mes }
        }
      );
      
      //console.log("query",listaEmpleados);

  let nombre_actual= "";
  let nombre_anterior = "";
  let cod_rep_anterior = "";

  let total_reparticion =0;
  let total_general =0;

  const empleadosTable = {
    style: 'tableplanilla',
    table: {
      headerRows: 2,
      widths: [20, 24, 26, 120, 10,  24,24,  24,24,24,24,24,25,  24],
      //heights: [50],
      //widths: [30, 25, 25, 120, 10  ], // Dos columnas de igual ancho
      body: [
        [
          {  colSpan: 14, alignment: 'left',border: [false, false, false, false],
            margin: [-5, 0, 0, 0],
            style: 'tableHeader',
            table: {
              //headerRows: 2,
              margin: [0, 0, 0, 0],
              widths: [170, 170, 80, 80],
              //heights: [20],
              body: [
                [{text:'Dirección Administrativa:',style:'titleheader',border: [false, false, false, false],},
                {text:'Unidad Ejecutora:',style:'titleheader',border: [false, false, false, false],},
                {text:'Coprobante:',style:'titleheader',border: [false, false, false, false],},
                {text:'Devengado:',style:'titleheader',border: [false, false, false, false],}
                ],
                [{text:'Ministerio de defenza',style:'textheader'},
                {text:'administracion central',style:'textheader'},
                {text:'',style:'textheader'},
                {text:'',style:'textheader'}
                ],
                  
              ]
            }

          },{},{},{},{},{},{},{},{},{},  {},{},{},{}
        ],
        // Encabezados de la tabla
        [{text:'Organi Repart Dept',style:'subheaderT',border:[true,true,true,true]},
          {text:'Código', style:'subheaderT' ,border:[true,true,true,true]},
          {text:'Doc. Id',style:'subheaderT', border:[true,true,true,true]},
          {text:'Nombre',style:'subheaderT', border:[true,true,true,true]},
          {text:'T.E.',style:'subheaderT', border:[true,true,true,true]},
          
          {text:'Saldo Actual',style:'subheaderT', border:[true,true,true,true]},
          {text:'Saldo Anterior',style:'subheaderT', border:[true,true,true,true]},

          {text:'Formulario 87',style:'subheaderT', border:[true,true,true,true]},
          {text:'Total Iva',style:'subheaderT', border:[true,true,true,true]},
          {text:'Ingreso Imponible',style:'subheaderT', border:[true,true,true,true]},
          {text:'Consumo Mes',style:'subheaderT', border:[true,true,true,true]},
          {text:'Descuento Iva',style:'subheaderT', border:[true,true,true,true]},
          {text:'Descuento Iva-Boleta',style:'subheaderT', border:[true,true,true,true]},

          {text:'Saldo Boleta',style:'subheaderT', border:[true,true,true,true]}
          
        ],
        
        

      ],
    },
    layout: {
      defaultBorder: false,
    }
    
  };
  docDefinition.content.push(empleadosTable);
        // Recorrer las regiones
  listaEmpleados.forEach((row) => {
    nombre_actual = row.nombre_reparticion;

    
      
      

      
        // Agregar título de región
      // docDefinition.content.push({
      //   text: `${municipio.municipio_reparticion[0].reparticion_organismo.nombre}`,
      //   style: 'subheader',
      //   margin: [0, 0, 0, 10], // Márgenes [izquierda, arriba, derecha, abajo]
      // });
            // Recorrer las empleado
      //reparticion.reparticion_asigCarEmp.forEach((asigempleado) => {

        // totalGanado += parseFloat( asigempleado.asignacioncargoemp_salarioplanilla[0].total_ganado);
        // asigempleado.asignacioncargoemp_salarioplanilla[0].bonos[0].bonos.forEach(( bonos) => {
        //   if (bonos.id_bono === 8) { //bono frontera
        //     //console.log('Color favorito encontrado:', preferences[key]);
        //     frontera = bonos.monto_bs;
        //   }else if(bonos.id_bono === 18 || bonos.id_bono === 19){ //bono 
        //       otrosIng += bonos.monto_bs;
        //   }else {
        //       bonosIng += bonos.monto_bs;
        //   }
        // });
        //aporte laboral
      //});

    if(nombre_anterior != nombre_actual ){
      if(nombre_anterior != ""){
        //total por reparticion
        empleadosTable.table.body.push(
          [
            { text: `Total Repartición ${cod_rep_anterior} ${nombre_anterior}`, colSpan: 12, alignment: 'left',border: [false, true, false, false], bold: 'true',  },{},{},{},{},{},{},{},{},{},  {},{},{ text: Number(total_reparticion.toFixed(2)) , bold: 'true', border: [false, true, false, false] },{ text: '', bold: 'true', border: [false, true, false, false]}
          ],
        );
        //docDefinition.content.push({ text: '', pageBreak: 'after' });
        total_general += total_reparticion;
        total_reparticion =0;
      }
      empleadosTable.table.body.push(
        [
          { text: `${row.nombre_organismo}`, colSpan: 14, alignment: 'left',border: [false, false, false, false],  },{},{},{},{},{},{},{},{},{},  {},{},{},{}
        ],
        [
          { text: `${row.nombre_reparticion}`, colSpan: 14, alignment: 'left',border: [false, false, false, false], margin: [1 , -5, 0, 0] },{},{},{},{},{},{},{},{},{},  {},{},{},{}
        ]
      );

      nombre_anterior = nombre_actual;      
      cod_rep_anterior = row.codigo_reparticion;
    } 
    total_reparticion += parseFloat(row.rciva_retenido);

    
    empleadosTable.table.body.push([ {},
      //console.log(".............. asignacion:", asigempleado.asignacioncargoemp_empleado),
      row.cod_empleado,
      row.numero_documento,
      {text: row.abreviatura +' '+ row.nombre +' '+ row.otro_nombre +' '+ row.paterno +' '+ row.materno, alignment:'left'},
      {},
      row.saldo_rciva_dependiente,
      row.total_saldo_mes_anterior,
      {},
      row.total_actualizacion,
      row.ingreso_neto_bs,
      row.importe_sujeto_impuesto,
      row.rciva_retenido,
      { text: row.rciva_retenido, border:[true,false,false,false] },
      row.saldo_rciva_dependiente     
    ]);
    
    
  
    

  });
  empleadosTable.table.body.push(
    [
      { text: `Total Repartición ${cod_rep_anterior} ${nombre_anterior}`, colSpan: 12, alignment: 'left',border: [false, true, false, false], bold: 'true',  },{},{},{},{},{},{},{},{},{},  {},{},{ text: Number(total_reparticion.toFixed(2)) , bold: 'true', border: [false, true, false, false] },{ text: '', bold: 'true', border: [false, true, false, false]}
    ],
  );
  //docDefinition.content.push({ text: '', pageBreak: 'after' });
  total_general += total_reparticion;
  
  // Agregar fila de empleado
    empleadosTable.table.body.push(//[{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
      [
      
      { text: 'TOTALES GENEREAL', colSpan: 12, style: 'totalPlanilla' ,border: [false, true, false, false] },  {},{},{},{},{},{},{},{},{},  {},{},
      { text: Number(total_general.toFixed(2)), style: 'totalPlanilla',border: [false, true, false, false] }, { text: "", style: 'totalPlanilla',border: [false, true, false, false]}
      
    ]
  );

      
      // Guardar el PDF generado
      //const pdfBytes = await pdfDoc.save();
      //fs.writeFileSync(outputFileName, pdfBytes);
      //console.log('PDF generado con éxito');
      // Crear el PDF
      const pdfDoc = pdfMake.createPdf(docDefinition);
      const nameFile = 'planilla_impositiva.pdf';//`${uuidv4()}.pdf`;
      const outputFileName = 'public/upload/'+nameFile;
      const filePath = path.join(__dirname, '../../public/upload/', nameFile);  // Ruta al archivo PDF en el servidor
      
      // Guardar el PDF en el sistema de archivos
      pdfDoc.getBuffer( (buffer) => {
          fs.writeFileSync(outputFileName, buffer);
          //res.setHeader('Content-Type', 'application/pdf');
          //res.setHeader('Content-Disposition', 'attachment; filename=reporte_empleados.pdf');
          //res.send(buffer);
      } );

      //const filePath = path.join(__dirname, '../../public/upload' , 'reporte_planilla.pdf' );  // Ruta al archivo PDF en el servidor
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="reporte_planilla.pdf"');
      
      // Enviar el archivo
      res.sendFile(filePath, (err) => {
        if (err) {
          console.log('Error al enviar el archivo:', err);
          res.status(500).send('Error al descargar el archivo.');
        }
      });

      //const aporteNew = await Reporte.create(body);
      // return res.status(201).json({
      //     ok: true,
      //     listaEmpleados
      //     //aporteNew
      // });
  } catch (error) {
      console.log("error:",error);
      return res.status(500).json({
        ok: false,
        errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
      });
  }
}

const newRepPlanillaSubsidio = async (req = request, res = response ) => {

  try {
      const  body   = req.body;
      
      const docDefinition = {
          pageSize: 'LEGAL',
          // {
          //   width: 12.9 *72,
          //   height: 8.5 * 72
          // },//'legal',
          pageMargins: [20, 30, 20, 20],
          //pageOrientation: 'landscape', // Orientación horizontal
          content: [],
          styles: {
            header: {
                fontSize: 10,
                bold: true,
                //margin: [0, 15, 0, 15]
            },
            titleheader: {
              fontSize: 7,
              bold: true,
              
              alignment: 'center'
              //margin: [0, 0, 0, 10]
            },
            totalPlanilla: {
              fontSize: 5,
              bold: true,
              
              alignment: 'right'
              //margin: [0, 0, 0, 10]
            },
            textheader: {
              fontSize: 7,
              bold: true,
              alignment: 'left'
            },
            subheaderT: {
              fontSize: 6,
              bold: true,
              alignment: 'left'
              
            },
            subheader: {
              fontSize: 6,
              bold: true,
            },
            tableExample: {
              margin: [0, 5, 0, 15]
            },
            tableplanilla: {
              fontSize: 5.5,
              alignment: 'right'
              //fillColor: 'blue',
              //fillOpacity: 0.3
            },
            tableOpacityExample: {
              margin: [0, 5, 0, 15],
              fillColor: 'blue',
              fillOpacity: 0.3
            },
            tableHeader: {
              bold: true,
              fontSize: 6,
              //color: 'black'
            }
          },
          defaultStyle: {
            // alignment: 'justify'
          },
          // defaultStyle: {
          //   font: 'Helvetica',
          // },
          
          header: function (currentPage, pageCount) {
            return [
              {
                    text: 'PLANILLA IMPOSITIVA',
                    alignment: 'center',
                    fontSize: 10,
                    bold: true,
                    margin: [0, 10, 0, 0], // Márgenes [izquierda, arriba, derecha, abajo]   
              },
              {
                text: '0020 MINISTERIO DE DEFENSA - 0020.01.001 Min.Defensa',
                    alignment: 'center',
                    fontSize: 6,
                    bold: true,
                    margin: [0, 0, 0, 0], // Márgenes [izquierda, arriba, derecha, abajo]
              },
      
            ];
          },
        
        };
      
      const listaEmpleados = await db.sequelize.query("SELECT mun.codigo as codigo_municipio, mun.nombre as nombre_municipio, td.nombre_abreviado as nombre_tipo_desc, emp.cod_empleado, emp.numero_documento, emp.nombre, emp.otro_nombre, emp.paterno, emp.materno, asu.tipo_pago, sum((desc_json->>'monto')::DECIMAL) as monto, ace.nro_item, count(*) as cantidad FROM municipios mun INNER JOIN reparticiones rep ON rep.id_municipio = mun.id INNER JOIN asignacion_cargo_empleados ace ON ace.id_reparticion = rep.id INNER JOIN salario_planillas sp ON sp.id_asig_cargo = ace.id JOIN LATERAL jsonb_array_elements(sp.subsidio) AS desc_json ON TRUE JOIN asignacion_subsidios asu ON (desc_json->>'id_asig_subsidio')::INTEGER = asu.id JOIN tipo_descuento_sanciones td ON td.id = asu.id_tipo_descuento join empleados emp on emp.id = sp.id_empleado WHERE td.tipo = 'SUBSIDIO' and rep.id_organismo = :idOrganismo AND sp.id_mes = :idMes group by codigo_municipio, nombre_municipio, nombre_tipo_desc, emp.cod_empleado, emp.numero_documento, emp.nombre, emp.otro_nombre, emp.paterno, emp.materno, asu.tipo_pago,  ace.nro_item order by nombre_municipio, emp.nombre ", 
        {   type: Sequelize.QueryTypes.SELECT, 
            replacements: {idOrganismo: body.id_organismo, idMes: body.id_mes }
        }
      );
      
      //console.log("query",listaEmpleados);

  
  const empleadosTable = {
    style: 'tableplanilla',
    table: {
      headerRows: 2,
      widths: [20, 10, 20, 26, 180,  26,15,  50,50,70],
      //heights: [50],
      //widths: [30, 25, 25, 120, 10  ], // Dos columnas de igual ancho
      body: [
        [
          {  colSpan: 10, alignment: 'left',border: [false, false, false, false],
            margin: [-5, 0, 0, 0],
            style: 'tableHeader',
            table: {
              //headerRows: 2,
              margin: [0, 0, 0, 0],
              widths: [170, 170, 80, 80],
              //heights: [20],
              body: [
                [{text:'Dirección Administrativa:',style:'titleheader',border: [false, false, false, false],},
                {text:'Unidad Ejecutora:',style:'titleheader',border: [false, false, false, false],},
                {text:'Coprobante:',style:'titleheader',border: [false, false, false, false],},
                {text:'Devengado:',style:'titleheader',border: [false, false, false, false],}
                ],
                [{text:'Ministerio de defenza',style:'textheader'},
                {text:'administracion central',style:'textheader'},
                {text:'',style:'textheader'},
                {text:'',style:'textheader'}
                ],
                  
              ]
            }

          },{},{},{},{},{},{},{},{},{}
        ],
        // Encabezados de la tabla
        [{text:'Categoria Mun Dept',style:'subheaderT',border:[true,true,true,true]},
          {text:'Nro', style:'subheaderT' ,border:[true,true,true,true]},
          {text:'Item', style:'subheaderT' ,border:[true,true,true,true]},
          {text:'Doc. Id',style:'subheaderT', border:[true,true,true,true]},
          {text:'Nombre',style:'subheaderT', border:[true,true,true,true]},
          {text:'Monto',style:'subheaderT', border:[true,true,true,true]},
          
          {text:'Cantidad',style:'subheaderT', border:[true,true,true,true]},
          {text:'Subsidio',style:'subheaderT', border:[true,true,true,true]},

          {text:'Tipo de Pago',style:'subheaderT', border:[true,true,true,true]},
          {text:'Acreedor',style:'subheaderT', border:[true,true,true,true]},          
        ],
        
      ],
    },
    layout: {
      defaultBorder: false,
    }
    
  };
  docDefinition.content.push(empleadosTable);
  
  let nombre_actual= "";
  let nombre_anterior = "";
  let cod_mun_anterior = "";

  let total_municipio =0;
  let total_general =0;
  let total_prenatal = 0;
  let total_natalidad = 0;
  let total_lactancia = 0;
  let total_defuncion = 0;
  let cant_prenatal = 0;
  let cant_natalidad = 0;
  let cant_lactancia = 0;
  let cant_defuncion = 0;
  let total_subsidio = 0;
  let total_cantidad = 0;
  listaEmpleados.forEach((row) => {
    nombre_actual = row.nombre_municipio;
    //console.log("nombre actual:", nombre_actual);
    if(nombre_anterior != nombre_actual ){
      if(nombre_anterior != ""){
        //total por reparticion
        empleadosTable.table.body.push(
          [
            { text: `Total Municipio ${cod_mun_anterior} ${nombre_anterior}`, colSpan: 5, alignment: 'left',border: [false, true, false, false], bold: 'true',  },{},{},{},{},{ text: Number(total_municipio.toFixed(2)) , bold: 'true', border: [false, true, false, false] },{ text: '', bold: 'true', colSpan:4, border: [false, true, false, false]},{},{},{}
          ],
        );
        //docDefinition.content.push({ text: '', pageBreak: 'after' });
        total_general += total_municipio;
        total_municipio =0;
      }
      empleadosTable.table.body.push(
        [
          { text: `${row.nombre_municipio}`, colSpan: 10, alignment: 'left',border: [false, false, false, false],  },{},{},{},{},{},{},{},{},{}
        ],
        // [
        //   { text: `${row.nombre_reparticion}`, colSpan: 14, alignment: 'left',border: [false, false, false, false], margin: [1 , -5, 0, 0] },{},{},{},{},{},{},{},{},{},  {},{},{},{}
        // ]
      );

      nombre_anterior = nombre_actual;      
      cod_mun_anterior = row.codigo_municipio;
    } 
    total_municipio += parseFloat(row.monto);

    
    empleadosTable.table.body.push([ {},{},
      //console.log(".............. asignacion:", asigempleado.asignacioncargoemp_empleado),
      row.nro_item,
      row.numero_documento,
      {text: row.paterno +' '+ row.materno +' '+ row.nombre +' '+ row.otro_nombre , alignment:'left'},
      row.monto,
      row.cantidad,
      row.nombre_tipo_desc,
      row.tipo_pago,
      {}
    ]);


    if(row.nombre_tipo_desc =='PRENATAL'){
      total_prenatal = parseFloat(row.monto);
      cant_prenatal +=1;
    }else if(row.nombre_tipo_desc =='NATALIDAD'){
      total_natalidad = parseFloat(row.monto);
      cant_natalidad +=1;
    }else if(row.nombre_tipo_desc =='LACTANCIA'){
      total_lactancia = parseFloat(row.monto);
      cant_lactancia +=1;
    }else if(row.nombre_tipo_desc =='CEPELIO'){
      total_defuncion = parseFloat(row.monto);
      cant_defuncion +=1;
    }

  });
  empleadosTable.table.body.push(
    [
      { text: `Total Municipio ${cod_mun_anterior} ${nombre_anterior}`, colSpan: 5, alignment: 'left',border: [false, true, false, false], bold: 'true',  },{},{},{},{},{ text: Number(total_municipio.toFixed(2)) , bold: 'true', border: [false, true, false, false] },{ text: '', bold: 'true', colSpan:4, border: [false, true, false, false]},{},{},{}
    ],
  );
    total_general += total_municipio;
    total_subsidio = total_prenatal + cant_natalidad + total_lactancia + total_defuncion;
    total_cantidad = cant_prenatal + cant_natalidad + cant_lactancia + cant_defuncion;
    
  // Agregar fila de empleado
    empleadosTable.table.body.push(
      [
      { text: 'TOTALES GENEREAL', colSpan: 5, style: 'totalPlanilla' ,border: [false, true, false, false] },  {},{},{},{},
      { text: Number(total_general.toFixed(2)), style: 'totalPlanilla',border: [false, true, false, false] }, { text: "", style: 'totalPlanilla',border: [false, true, false, false]},{},{},{}
      ]
    );

  //tabla
  docDefinition.content.push(
      {
        style: 'tableExample',
        color: '#444',
        table: {
          widths: ['auto', 'auto', 'auto'],
          headerRows: 2,
          // keepWithHeaderRows: 1,
          body: [
            [{ text: 'RESUMEN', style: 'tableHeader', colSpan: 3, alignment: 'center' }, {}, {} ],
            [{ text: 'Subsidio', style: 'tableHeader', alignment: 'center' }, { text: 'cantidad', style: 'tableHeader', alignment: 'center' }, { text: 'Monto por Subsidio', style: 'tableHeader', alignment: 'center' }],
            [{ text: 'Prenatal', style: 'totalPlanilla',border: [true, false, false, false] }, { text: cant_prenatal, style: 'totalPlanilla',border: [true, false, false, false] },{ text: Number(total_prenatal.toFixed(2)), style: 'totalPlanilla',border: [true, false, true, false] }, ],
            [{ text: 'Natalidad', style: 'totalPlanilla',border: [true, false, false, false] }, { text: cant_natalidad, style: 'totalPlanilla',border: [true, false, false, false] },{ text: Number(total_natalidad.toFixed(2)), style: 'totalPlanilla',border: [true, false, true, false] }, ],
            [{ text: 'Lactancia', style: 'totalPlanilla',border: [true, false, false, false] }, { text: cant_lactancia, style: 'totalPlanilla',border: [true, false, false, false] },{ text: Number(total_lactancia.toFixed(2)), style: 'totalPlanilla',border: [true, false, true, false] }, ],
            [{ text: 'Defuncion', style: 'totalPlanilla',border: [true, false, false, false] }, { text: cant_defuncion, style: 'totalPlanilla',border: [true, false, false, false] },{ text: Number(total_defuncion.toFixed(2)), style: 'totalPlanilla',border: [true, false, true,false] }, ],
            [{ text: 'TOTAL', style: 'totalPlanilla' }, { text: total_cantidad, style: 'totalPlanilla', },{ text: Number(total_subsidio.toFixed(2)), style: 'totalPlanilla' }, ]
          ]
        }
      },
    );
  
    
  const pdfDoc = pdfMake.createPdf(docDefinition);
      const nameFile = 'planilla_subsidio.pdf';//`${uuidv4()}.pdf`;
      const outputFileName = 'public/upload/'+nameFile;
      const filePath = path.join(__dirname, '../../public/upload/', nameFile);  // Ruta al archivo PDF en el servidor
      
      // Guardar el PDF en el sistema de archivos
      pdfDoc.getBuffer( (buffer) => {
          fs.writeFileSync(outputFileName, buffer);
      } );

      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="reporte_planilla.pdf"');
      
      // Enviar el archivo
      res.sendFile(filePath, (err) => {
        if (err) {
          console.log('Error al enviar el archivo:', err);
          res.status(500).send('Error al descargar el archivo.');
        }
      });

  
  } catch (error) {
      console.log("error:",error);
      return res.status(500).json({
        ok: false,
        errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
      });
  }
}

const newRepPlanillaSubsidioNew = async (req = request, res = response ) => {

  try {
      const  body   = req.body;
      
      const docDefinition = {
          pageSize: 'LEGAL',
          // {
          //   width: 12.9 *72,
          //   height: 8.5 * 72
          // },//'legal',
          pageMargins: [20, 30, 20, 20],
          //pageOrientation: 'landscape', // Orientación horizontal
          content: [],
          styles: {
            header: {
                fontSize: 10,
                bold: true,
                //margin: [0, 15, 0, 15]
            },
            titleheader: {
              fontSize: 7,
              bold: true,
              
              alignment: 'center'
              //margin: [0, 0, 0, 10]
            },
            totalPlanilla: {
              fontSize: 5,
              bold: true,
              
              alignment: 'right'
              //margin: [0, 0, 0, 10]
            },
            textheader: {
              fontSize: 7,
              bold: true,
              alignment: 'left'
            },
            subheaderT: {
              fontSize: 6,
              bold: true,
              alignment: 'left'
              
            },
            subheader: {
              fontSize: 6,
              bold: true,
            },
            tableExample: {
              margin: [0, 5, 0, 15]
            },
            tableplanilla: {
              fontSize: 5.5,
              alignment: 'right'
              //fillColor: 'blue',
              //fillOpacity: 0.3
            },
            tableOpacityExample: {
              margin: [0, 5, 0, 15],
              fillColor: 'blue',
              fillOpacity: 0.3
            },
            tableHeader: {
              bold: true,
              fontSize: 6,
              //color: 'black'
            }
          },
          defaultStyle: {
            // alignment: 'justify'
          },
          // defaultStyle: {
          //   font: 'Helvetica',
          // },
          
          header: function (currentPage, pageCount) {
            return [
              {
                    text: 'PLANILLA IMPOSITIVA',
                    alignment: 'center',
                    fontSize: 10,
                    bold: true,
                    margin: [0, 10, 0, 0], // Márgenes [izquierda, arriba, derecha, abajo]   
              },
              {
                text: '0020 MINISTERIO DE DEFENSA - 0020.01.001 Min.Defensa',
                    alignment: 'center',
                    fontSize: 6,
                    bold: true,
                    margin: [0, 0, 0, 0], // Márgenes [izquierda, arriba, derecha, abajo]
              },
      
            ];
          },
        
        };
      
      
      //console.log("query",listaEmpleados);

  
  
  

  


  const listaDescuento = await Tipo_descuento_sancion.findAll({where: { activo:1, tipo : 'SUBSIDIO' }} );
  let total_general =0, i=0;  

  let total_prenatal = 0;
  let total_natalidad = 0;
  let total_lactancia = 0;
  let total_defuncion = 0;  
  let resumenTipoDesc = [];

  for (const fila of listaDescuento){
    
    const empleadosTable = getTablaSubidio();
    
    const listaEmpleados = await db.sequelize.query("SELECT mun.codigo as codigo_municipio, mun.nombre as nombre_municipio, emp.cod_empleado, emp.numero_documento, emp.nombre, emp.otro_nombre, emp.paterno, emp.materno,emp.sexo, asu.tipo_pago, (desc_json->>'monto')::DECIMAL as monto, ace.nro_item, ba.ci_ruc, ba.detalle_ruc, ba.nro_cuenta FROM municipios mun INNER JOIN reparticiones rep ON rep.id_municipio = mun.id INNER JOIN asignacion_cargo_empleados ace ON ace.id_reparticion = rep.id INNER JOIN salario_planillas sp ON sp.id_asig_cargo = ace.id JOIN LATERAL jsonb_array_elements(sp.subsidio) AS desc_json ON TRUE JOIN asignacion_subsidios asu ON (desc_json->>'id_asig_subsidio')::INTEGER = asu.id join empleados emp on emp.id = sp.id_empleado JOIN beneficiario_acreedores ba ON asu.id = ba.id_asig_subsidio WHERE rep.id_organismo = :idOrganismo AND sp.id_mes = :idMes and asu.id_tipo_descuento = :idTipoDescuento order by nombre_municipio, emp.nombre ", 
        {   type: Sequelize.QueryTypes.SELECT, 
            replacements: {idOrganismo: body.id_organismo, idMes: body.id_mes, idTipoDescuento: fila.id }
        }
      );
    
    if(listaEmpleados && listaEmpleados.length >0 ){

      empleadosTable.table.body.push(
        [
          { text: `Subsidio: ${fila.nombre_abreviado}`, fontSize:'9' ,colSpan: 15, alignment: 'left',border: [false, false, false, false],  },{},{},{},{},{},{},{},{},{},  {},{},{},{},{} 
        ],        
      );

      let nombre_actual= "";
      let nombre_anterior = "";
      let total_municipio =0;
      let total_general_tdesc =0;
      let cantidad = 0;

      //lista empleado
      listaEmpleados.forEach((row) => {
        nombre_actual = row.nombre_municipio;
        if(nombre_anterior != nombre_actual  ){
          if(nombre_anterior != ""){
            //total por reparticion
            empleadosTable.table.body.push(
              [
                { text: `Total municipio  ${nombre_anterior}`, colSpan: 8, alignment: 'left',border: [false, true, false, false], bold: 'true',  },{},{},{},{},{},{},{}, { text: Number(total_municipio.toFixed(2)) , bold: 'true', border: [false, true, false, false] },{ text: '', bold: 'true', colSpan:6, border: [false, true, false, false]},{},{},{},{},{}
              ],
            );
            //docDefinition.content.push({ text: '', pageBreak: 'after' });
            total_general_tdesc += total_municipio;
            total_general += total_municipio;
            total_municipio =0;
          }
    
          empleadosTable.table.body.push(
            [
              { text: `${row.nombre_municipio}`, colSpan: 15, alignment: 'left',border: [false, false, false, false],  },{},{},{},{}, {},{},{},{},{}, {},{},{},{},{}
            ],
          );
    
          nombre_anterior = nombre_actual;      
          cod_mun_anterior = row.codigo_municipio;
          
        }
         
        total_municipio += parseFloat(row.monto);
        cantidad = cantidad + 1;
        //total_tipo_sub += parseFloat(row.monto);
    
        
        empleadosTable.table.body.push([ {},{},
          //console.log(".............. asignacion:", asigempleado.asignacioncargoemp_empleado),
          row.cod_empleado,
          {text: row.paterno +' '+ row.materno +' '+ row.nombre +' '+ row.otro_nombre , alignment:'left'},
          row.sexo,
          {},
          {},
          row.ci_ruc,
          row.detalle_ruc,
          row.nro_cuenta,
          {},
          {},
          {},
          {},
          {}
        ]);

       });

      empleadosTable.table.body.push(
        [
          { text: `Total municipio  ${nombre_anterior}`, colSpan: 8, alignment: 'left',border: [false, true, false, false], bold: 'true',  },{},{},{},{},{},{},{}, { text: Number(total_municipio.toFixed(2)) , bold: 'true', border: [false, true, false, false] },{ text: '', bold: 'true', colSpan:6, border: [false, true, false, false]},{},{},{},{},{}
        ],
      );
      total_general_tdesc += total_municipio;
      total_general += total_municipio;

      empleadosTable.table.body.push(
        [
        { text: 'TOTALES TIPO DESCUENTO', colSpan: 8, style: 'totalPlanilla' ,border: [false, true, false, false] },  {},{},{},{},{},{},{},
        { text: Number(total_general_tdesc.toFixed(2)), style: 'totalPlanilla',border: [false, true, false, false] }, { text: "", style: 'totalPlanilla', colSpan:6, border: [false, true, false, false]},{},{},{},{},{}
        ]
      );

      resumenTipoDesc.push({
       tipo:fila.nombre_abreviado,
       cantidad:cantidad,
       total:total_general_tdesc 
      });
      
      docDefinition.content.push(empleadosTable);
      docDefinition.content.push({ text: '', pageBreak: 'before' });
    }

    
    
    i +=1;
    if(i === listaDescuento.length -1 ){
      empleadosTable.table.body.push(
        [
        { text: 'TOTAL GENERAL', colSpan: 8, style: 'totalPlanilla' ,border: [false, true, false, false] },  {},{},{},{},{},{},{},
        { text: Number( total_general.toFixed(2)), style: 'totalPlanilla',border: [false, true, false, false] }, { text: "", style: 'totalPlanilla', colSpan:6, border: [false, true, false, false]},{},{},{},{},{}
        ]
      );
      let total_subsidio = resumenTipoDesc[0].total + resumenTipoDesc[1].total + resumenTipoDesc[2].total + resumenTipoDesc[3].total;
      let total_cantidad = resumenTipoDesc[0].cantidad + resumenTipoDesc[1].cantidad + resumenTipoDesc[2].cantidad + resumenTipoDesc[3].cantidad;

      empleadosTable.table.body.push(
        [
          {  colSpan: 15, alignment: 'left',border: [false, false, false, false],
            margin: [-5, 0, 0, 0],
            style: 'tableHeader',
            table: {
              widths: ['auto', 'auto', 'auto'],
              headerRows: 2,
              // keepWithHeaderRows: 1,
              body: [
                [{ text: 'RESUMEN', style: 'tableHeader', colSpan: 3, alignment: 'center' }, {}, {} ],
                [{ text: 'Subsidio', style: 'tableHeader', alignment: 'center' }, { text: 'cantidad', style: 'tableHeader', alignment: 'center' }, { text: 'Monto por Subsidio', style: 'tableHeader', alignment: 'center' }],
                [{ text: 'Prenatal', style: 'totalPlanilla',border: [true, false, false, false] }, { text: resumenTipoDesc[0].cantidad , style: 'totalPlanilla',border: [true, false, false, false] },{ text: Number(resumenTipoDesc[0].total.toFixed(2)), style: 'totalPlanilla',border: [true, false, true, false] }, ],
                [{ text: 'Natalidad', style: 'totalPlanilla',border: [true, false, false, false] }, { text: resumenTipoDesc[1].cantidad , style: 'totalPlanilla',border: [true, false, false, false] },{ text: Number(resumenTipoDesc[1].total.toFixed(2)), style: 'totalPlanilla',border: [true, false, true, false] }, ],
                [{ text: 'Lactancia', style: 'totalPlanilla',border: [true, false, false, false] }, { text: resumenTipoDesc[2].cantidad, style: 'totalPlanilla',border: [true, false, false, false] },{ text: Number(resumenTipoDesc[2].total.toFixed(2)), style: 'totalPlanilla',border: [true, false, true, false] }, ],
                [{ text: 'Defuncion', style: 'totalPlanilla',border: [true, false, false, false] }, { text: resumenTipoDesc[3].cantidad , style: 'totalPlanilla',border: [true, false, false, false] },{ text: Number( resumenTipoDesc[3].total.toFixed(2)), style: 'totalPlanilla',border: [true, false, true,false] }, ],
                [{ text: 'TOTAL', style: 'totalPlanilla' }, { text: total_cantidad, style: 'totalPlanilla', },{ text: Number(total_subsidio.toFixed(2)), style: 'totalPlanilla' }, ]
              ]
            }

          },{},{},{},{}, {},{},{},{},{}, {},{},{},{},{}
        ]
      );

      
    }

  }
   
  const pdfDoc = pdfMake.createPdf(docDefinition);
      const nameFile = 'planilla_subsidio_dos.pdf';//`${uuidv4()}.pdf`;
      const outputFileName = 'public/upload/'+nameFile;
      const filePath = path.join(__dirname, '../../public/upload/', nameFile);  // Ruta al archivo PDF en el servidor
      
      // Guardar el PDF en el sistema de archivos
      pdfDoc.getBuffer( (buffer) => {
          fs.writeFileSync(outputFileName, buffer);
      } );

      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="reporte_planilla.pdf"');
      
      // Enviar el archivo
      res.sendFile(filePath, (err) => {
        if (err) {
          console.log('Error al enviar el archivo:', err);
          res.status(500).send('Error al descargar el archivo.');
        }
      });

  } catch (error) {
      console.log("error:",error);
      return res.status(500).json({
        ok: false,
        errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
      });
  }
}

function getTablaSubidio(){
  const empleadosTable = {
    style: 'tableplanilla',
    table: {
      headerRows: 2,
      widths: [15, 10, 20,120,10, 10,10,22,120, 50,7,7,7,7,7 ],
      //heights: [50],
      //widths: [30, 25, 25, 120, 10  ], // Dos columnas de igual ancho
      body: [
        [
          {  colSpan: 15, alignment: 'left',border: [false, false, false, false],
            margin: [-5, 0, 0, 0],
            style: 'tableHeader',
            table: {
              //headerRows: 2,
              margin: [0, 0, 0, 0],
              widths: [170, 170, 80, 80],
              //heights: [20],
              body: [
                [{text:'Dirección Administrativa:',style:'titleheader',border: [false, false, false, false],},
                {text:'Unidad Ejecutora:',style:'titleheader',border: [false, false, false, false],},
                {text:'Coprobante:',style:'titleheader',border: [false, false, false, false],},
                {text:'Devengado:',style:'titleheader',border: [false, false, false, false],}
                ],
                [{text:'Ministerio de defenza',style:'textheader'},
                {text:'administracion central',style:'textheader'},
                {text:'',style:'textheader'},
                {text:'',style:'textheader'}
                ],
                  
              ]
            }

          },{},{},{},{}, {},{},{},{},{}, {},{},{},{},{}
        ],
        // Encabezados de la tabla
        [ {text:'Categoria Mun Dept', rowSpan: 2, style:'subheaderT',border:[true,true,true,true]},
          {text:'Nro', rowSpan: 2, style:'subheaderT' ,border:[true,true,true,true]},
          {text:'TITULAR', colSpan:3, style:'subheaderT' ,border:[true,true,true,true]},{},{},
          {text:'BENEFICIARIA', colSpan:10, style:'subheaderT' ,border:[true,true,true,true]},{},{},{},{}, {},{},{},{},{},
        ],
        [ {},{},
          {text:'CodPer', style:'subheaderT' ,border:[true,true,true,true]},
          {text:'Nombre', style:'subheaderT' ,border:[true,true,true,true]},
          {text:'Sexo', style:'subheaderT' ,border:[true,true,true,true]},
          {text:'', style:'subheaderT' ,border:[true,true,true,true]},
          {text:'Código', style:'subheaderT' ,border:[true,true,true,true]},
          {text:'Carnet', style:'subheaderT' ,border:[true,true,true,true]},
          {text:'Nombre', style:'subheaderT' ,border:[true,true,true,true]},
          {text:'Nro Cuenta', style:'subheaderT' ,border:[true,true,true,true]},
          {text:'Or', style:'subheaderT' ,border:[true,true,true,true]},
          {text:'Pen', style:'subheaderT' ,border:[true,true,true,true]},
          {text:'Rei', style:'subheaderT' ,border:[true,true,true,true]},
          {text:'Mon', style:'subheaderT' ,border:[true,true,true,true]},
          {text:'Can', style:'subheaderT' ,border:[true,true,true,true]},
        ],
      ],
    },
    layout: {
      defaultBorder: false,
    }
    
  };
  return empleadosTable;
}

const newRepDescAcreedor = async (req = request, res = response ) => {

  try {
      const  body   = req.body;
      
      const docDefinition = {
          pageSize: 'LEGAL',
          // {
          //   width: 12.9 *72,
          //   height: 8.5 * 72
          // },//'legal',
          pageMargins: [20, 30, 20, 20],
          //pageOrientation: 'landscape', // Orientación horizontal
          content: [],
          styles: {
            header: {
                fontSize: 10,
                bold: true,
                //margin: [0, 15, 0, 15]
            },
            titleheader: {
              fontSize: 7,
              bold: true,
              
              alignment: 'center'
              //margin: [0, 0, 0, 10]
            },
            totalPlanilla: {
              fontSize: 5,
              bold: true,
              
              alignment: 'right'
              //margin: [0, 0, 0, 10]
            },
            textheader: {
              fontSize: 7,
              bold: true,
              alignment: 'left'
            },
            subheaderT: {
              fontSize: 6,
              bold: true,
              alignment: 'left'
              
            },
            subheader: {
              fontSize: 6,
              bold: true,
            },
            tableExample: {
              margin: [0, 5, 0, 15]
            },
            tableplanilla: {
              fontSize: 5.5,
              alignment: 'right'
              //fillColor: 'blue',
              //fillOpacity: 0.3
            },
            tableOpacityExample: {
              margin: [0, 5, 0, 15],
              fillColor: 'blue',
              fillOpacity: 0.3
            },
            tableHeader: {
              bold: true,
              fontSize: 6,
              //color: 'black'
            }
          },
          defaultStyle: {
            // alignment: 'justify'
          },
          // defaultStyle: {
          //   font: 'Helvetica',
          // },
          
          header: function (currentPage, pageCount) {
            return [
              {
                    text: 'PLANILLA IMPOSITIVA',
                    alignment: 'center',
                    fontSize: 10,
                    bold: true,
                    margin: [0, 10, 0, 0], // Márgenes [izquierda, arriba, derecha, abajo]   
              },
              {
                text: '0020 MINISTERIO DE DEFENSA - 0020.01.001 Min.Defensa',
                    alignment: 'center',
                    fontSize: 6,
                    bold: true,
                    margin: [0, 0, 0, 0], // Márgenes [izquierda, arriba, derecha, abajo]
              },
      
            ];
          },
        
        };
      
      
  const listaAcredores = await Tipo_descuento_sancion.findAll({where: { activo:1, tipo : 'SUBSIDIO' }} );
  let total_general =0, i=0;  

  let total_prenatal = 0;
  let total_natalidad = 0;
  let total_lactancia = 0;
  let total_defuncion = 0;  
  let resumenTipoDesc = [];

  for (const fila of listaDescuento){
    
    const empleadosTable = getTablaSubidio();
    
    const listaEmpleados = await db.sequelize.query("SELECT mun.codigo as codigo_municipio, mun.nombre as nombre_municipio, emp.cod_empleado, emp.numero_documento, emp.nombre, emp.otro_nombre, emp.paterno, emp.materno,emp.sexo, asu.tipo_pago, (desc_json->>'monto')::DECIMAL as monto, ace.nro_item, ba.ci_ruc, ba.detalle_ruc, ba.nro_cuenta FROM municipios mun INNER JOIN reparticiones rep ON rep.id_municipio = mun.id INNER JOIN asignacion_cargo_empleados ace ON ace.id_reparticion = rep.id INNER JOIN salario_planillas sp ON sp.id_asig_cargo = ace.id JOIN LATERAL jsonb_array_elements(sp.subsidio) AS desc_json ON TRUE JOIN asignacion_subsidios asu ON (desc_json->>'id_asig_subsidio')::INTEGER = asu.id join empleados emp on emp.id = sp.id_empleado JOIN beneficiario_acreedores ba ON asu.id = ba.id_asig_subsidio WHERE rep.id_organismo = :idOrganismo AND sp.id_mes = :idMes and asu.id_tipo_descuento = :idTipoDescuento order by nombre_municipio, emp.nombre ", 
        {   type: Sequelize.QueryTypes.SELECT, 
            replacements: {idOrganismo: body.id_organismo, idMes: body.id_mes, idTipoDescuento: fila.id }
        }
      );
    
    if(listaEmpleados && listaEmpleados.length >0 ){

      empleadosTable.table.body.push(
        [
          { text: `Subsidio: ${fila.nombre_abreviado}`, fontSize:'9' ,colSpan: 15, alignment: 'left',border: [false, false, false, false],  },{},{},{},{},{},{},{},{},{},  {},{},{},{},{} 
        ],        
      );

      let nombre_actual= "";
      let nombre_anterior = "";
      let total_municipio =0;
      let total_general_tdesc =0;
      let cantidad = 0;

      //lista empleado
      listaEmpleados.forEach((row) => {
        nombre_actual = row.nombre_municipio;
        if(nombre_anterior != nombre_actual  ){
          if(nombre_anterior != ""){
            //total por reparticion
            empleadosTable.table.body.push(
              [
                { text: `Total municipio  ${nombre_anterior}`, colSpan: 8, alignment: 'left',border: [false, true, false, false], bold: 'true',  },{},{},{},{},{},{},{}, { text: Number(total_municipio.toFixed(2)) , bold: 'true', border: [false, true, false, false] },{ text: '', bold: 'true', colSpan:6, border: [false, true, false, false]},{},{},{},{},{}
              ],
            );
            //docDefinition.content.push({ text: '', pageBreak: 'after' });
            total_general_tdesc += total_municipio;
            total_general += total_municipio;
            total_municipio =0;
          }
    
          empleadosTable.table.body.push(
            [
              { text: `${row.nombre_municipio}`, colSpan: 15, alignment: 'left',border: [false, false, false, false],  },{},{},{},{}, {},{},{},{},{}, {},{},{},{},{}
            ],
          );
    
          nombre_anterior = nombre_actual;      
          cod_mun_anterior = row.codigo_municipio;
          
        }
         
        total_municipio += parseFloat(row.monto);
        cantidad = cantidad + 1;
        //total_tipo_sub += parseFloat(row.monto);
    
        
        empleadosTable.table.body.push([ {},{},
          //console.log(".............. asignacion:", asigempleado.asignacioncargoemp_empleado),
          row.cod_empleado,
          {text: row.paterno +' '+ row.materno +' '+ row.nombre +' '+ row.otro_nombre , alignment:'left'},
          row.sexo,
          {},
          {},
          row.ci_ruc,
          row.detalle_ruc,
          row.nro_cuenta,
          {},
          {},
          {},
          {},
          {}
        ]);

       });

      empleadosTable.table.body.push(
        [
          { text: `Total municipio  ${nombre_anterior}`, colSpan: 8, alignment: 'left',border: [false, true, false, false], bold: 'true',  },{},{},{},{},{},{},{}, { text: Number(total_municipio.toFixed(2)) , bold: 'true', border: [false, true, false, false] },{ text: '', bold: 'true', colSpan:6, border: [false, true, false, false]},{},{},{},{},{}
        ],
      );
      total_general_tdesc += total_municipio;
      total_general += total_municipio;

      empleadosTable.table.body.push(
        [
        { text: 'TOTALES TIPO DESCUENTO', colSpan: 8, style: 'totalPlanilla' ,border: [false, true, false, false] },  {},{},{},{},{},{},{},
        { text: Number(total_general_tdesc.toFixed(2)), style: 'totalPlanilla',border: [false, true, false, false] }, { text: "", style: 'totalPlanilla', colSpan:6, border: [false, true, false, false]},{},{},{},{},{}
        ]
      );

      resumenTipoDesc.push({
       tipo:fila.nombre_abreviado,
       cantidad:cantidad,
       total:total_general_tdesc 
      });
      
      docDefinition.content.push(empleadosTable);
      docDefinition.content.push({ text: '', pageBreak: 'before' });
    }

    
    
    i +=1;
    if(i === listaDescuento.length -1 ){
      empleadosTable.table.body.push(
        [
        { text: 'TOTAL GENERAL', colSpan: 8, style: 'totalPlanilla' ,border: [false, true, false, false] },  {},{},{},{},{},{},{},
        { text: Number( total_general.toFixed(2)), style: 'totalPlanilla',border: [false, true, false, false] }, { text: "", style: 'totalPlanilla', colSpan:6, border: [false, true, false, false]},{},{},{},{},{}
        ]
      );
      let total_subsidio = resumenTipoDesc[0].total + resumenTipoDesc[1].total + resumenTipoDesc[2].total + resumenTipoDesc[3].total;
      let total_cantidad = resumenTipoDesc[0].cantidad + resumenTipoDesc[1].cantidad + resumenTipoDesc[2].cantidad + resumenTipoDesc[3].cantidad;

      empleadosTable.table.body.push(
        [
          {  colSpan: 15, alignment: 'left',border: [false, false, false, false],
            margin: [-5, 0, 0, 0],
            style: 'tableHeader',
            table: {
              widths: ['auto', 'auto', 'auto'],
              headerRows: 2,
              // keepWithHeaderRows: 1,
              body: [
                [{ text: 'RESUMEN', style: 'tableHeader', colSpan: 3, alignment: 'center' }, {}, {} ],
                [{ text: 'Subsidio', style: 'tableHeader', alignment: 'center' }, { text: 'cantidad', style: 'tableHeader', alignment: 'center' }, { text: 'Monto por Subsidio', style: 'tableHeader', alignment: 'center' }],
                [{ text: 'Prenatal', style: 'totalPlanilla',border: [true, false, false, false] }, { text: resumenTipoDesc[0].cantidad , style: 'totalPlanilla',border: [true, false, false, false] },{ text: Number(resumenTipoDesc[0].total.toFixed(2)), style: 'totalPlanilla',border: [true, false, true, false] }, ],
                [{ text: 'Natalidad', style: 'totalPlanilla',border: [true, false, false, false] }, { text: resumenTipoDesc[1].cantidad , style: 'totalPlanilla',border: [true, false, false, false] },{ text: Number(resumenTipoDesc[1].total.toFixed(2)), style: 'totalPlanilla',border: [true, false, true, false] }, ],
                [{ text: 'Lactancia', style: 'totalPlanilla',border: [true, false, false, false] }, { text: resumenTipoDesc[2].cantidad, style: 'totalPlanilla',border: [true, false, false, false] },{ text: Number(resumenTipoDesc[2].total.toFixed(2)), style: 'totalPlanilla',border: [true, false, true, false] }, ],
                [{ text: 'Defuncion', style: 'totalPlanilla',border: [true, false, false, false] }, { text: resumenTipoDesc[3].cantidad , style: 'totalPlanilla',border: [true, false, false, false] },{ text: Number( resumenTipoDesc[3].total.toFixed(2)), style: 'totalPlanilla',border: [true, false, true,false] }, ],
                [{ text: 'TOTAL', style: 'totalPlanilla' }, { text: total_cantidad, style: 'totalPlanilla', },{ text: Number(total_subsidio.toFixed(2)), style: 'totalPlanilla' }, ]
              ]
            }

          },{},{},{},{}, {},{},{},{},{}, {},{},{},{},{}
        ]
      );

      
    }

  }
   
  const pdfDoc = pdfMake.createPdf(docDefinition);
      const nameFile = 'planilla_subsidio_dos.pdf';//`${uuidv4()}.pdf`;
      const outputFileName = 'public/upload/'+nameFile;
      const filePath = path.join(__dirname, '../../public/upload/', nameFile);  // Ruta al archivo PDF en el servidor
      
      // Guardar el PDF en el sistema de archivos
      pdfDoc.getBuffer( (buffer) => {
          fs.writeFileSync(outputFileName, buffer);
      } );

      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="reporte_planilla.pdf"');
      
      // Enviar el archivo
      res.sendFile(filePath, (err) => {
        if (err) {
          console.log('Error al enviar el archivo:', err);
          res.status(500).send('Error al descargar el archivo.');
        }
      });

  } catch (error) {
      console.log("error:",error);
      return res.status(500).json({
        ok: false,
        errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
      });
  }
}

const newReport = async (req = request, res = response ) => {
// Definir el contenido del PDF
const docDefinition = {
  content: [
    { text: `Reporte de Planilla - Región: ` },
    { text: `Departamento:` },
    { text: 'Contenido del reporte aquí...' },
  ],
  
};

  // Crear el PDF
  const pdfDoc = pdfMake.createPdf(docDefinition);

  // Obtener el PDF en un buffer para luego enviarlo
  pdfDoc.getBuffer((buffer) => {
    // Guardar temporalmente el PDF para enviarlo
    const filePath = path.join(__dirname, 'reporte_planilla.pdf');
    fs.writeFileSync(filePath, buffer);

    // Enviar el archivo PDF como respuesta
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte_planilla.pdf"');
    res.send(buffer);

    // Elimina el archivo temporal después de enviarlo (opcional)
    // fs.unlink(filePath, (err) => {
    //   if (err) {
    //     console.error('Error al eliminar el archivo temporal', err);
    //   }
    // });
  });

// const pdfDoc = new PdfMake(docDefinition);
//     const pdfBuffer = pdfDoc.output('buffer');

// res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', 'attachment; filename="mi-pdf.pdf"');

//     // Enviar el buffer como respuesta
//     res.send(pdfBuffer)

};


module.exports = {
    //getAportePaginate,
    newRepPlanilla,
    newRepPlanillaImpositiva,
    newRepPlanillaSubsidio,
    newRepPlanillaSubsidioNew,
    newRepDescAcreedor
    //updateAporte,
    //activeInactiveAporte
};