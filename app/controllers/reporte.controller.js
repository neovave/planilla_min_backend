
const { response, request } = require('express');
const { Op } = require("sequelize");
const { Salario_planilla ,Organismo, Reparticion, Asignacion_cargo_empleado,Municipio,sequelize} = require('../database/config');
const paginate = require('../helpers/paginate');
const moment = require('moment');
//const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');


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
        const { body } = req.body;

        const docDefinition = {
            pageSize: {
              
              width: 12.9 *72,
              height: 8.5 * 72
            },//'legal',
            pageMargins: [20, 30, 20, 20],
            pageOrientation: 'landscape', // Orientación horizontal
            content: [],
            // styles: {
            //     header: {
            //         fontSize: 10,
            //         bold: true,
            //         //margin: [0, 15, 0, 15]
            //     },
            //     SubHeader: {
            //         fontSize: 7,
            //         bold: true,
            //         //margin: [0, 15, 0, 15]
            //     },
            //     tableExample: {
            //         margin: [0, 5, 0, 15],
            //         fontSize: 10,
            //         alignment: 'center'
            //     }
            // }
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
                // {
                //   style: 'tableHeader',
                //   table: {
                //     //headerRows: 2,
                //     margin: [500, 10, 0, 20],
                //     widths: [320, 320, 100, 150],
                //     body: [
                //       [{text:'Dirección Administrativa:',style:'titleheader',border: [false, false, false, false],},
                //       {text:'Unidad Ejecutora:',style:'titleheader',border: [false, false, false, false],},
                //       {text:'Coprobante:',style:'titleheader',border: [false, false, false, false],},
                //       {text:'Devengado:',style:'titleheader',border: [false, false, false, false],}
                //       ],
                //       [{text:'Ministerio de defenza',style:'textheader'},
                //       {text:'administracion central',style:'textheader'},
                //       {text:'',style:'textheader'},
                //       {text:'',style:'textheader'}
                //       ],
                        
                //     ]
                //   }
                //   // style: 'tableHeader',
                //   // table: {
                //   //   widths: ['*', '*', '*'],
                //   //   body: [
                //   //     [{ text: 'Empresa', bold: true }, { text: 'Dirección', bold: true }, { text: 'Teléfono', bold: true }],
                //   //     ['Empresa XYZ', 'Av. Siempre Viva 123', '(123) 456-7890'],
                //   //   ],
                //   // },
                //   // //layout: 'noBorders', // Quitar bordes de la tabla
                //   // margin: [0, 10, 0, 20], // Márgenes [izquierda, arriba, derecha, abajo]
                // },
                // {
                //   text: `Página ${currentPage} de ${pageCount}`,
                //   alignment: 'right',
                //   margin: [0, 0, 30, 0], // Márgenes [izquierda, arriba, derecha, abajo]
                //   fontSize: 10,
                //   italics: true,
                // },
              ];
            },
          
          };
        // docDefinition.content.push({
        //     text: `DETALLE DESGLOSADO DE INGRESOS Y DESCUENTOS POR ITEM Y EMPLEADO`,
        //     style: 'header',
        //     margin: [270, -30, 0, 10], // Márgenes [izquierda, arriba, derecha, abajo]
        // });
        // docDefinition.content.push({
        //     text: `0020 MINISTERIO DE DEFENSA - 0020.01.001 Min.Defensa`,
        //     style: 'subheader',
        //     margin: [350, -10, 0, 10], // Márgenes [izquierda, arriba, derecha, abajo]
        // });
        //lista empleados await Mes.findOne({where: { id:body.id_mes }} );
        // const listaEmpleados = await Salario_planilla.findAll(
        //     {
        //         attributes: { exclude: ['createdAt'] },
        //         order: [['id', 'ASC']],
        //         where: { 
        //             [Op.and]: [
        //                 { activo:1 },{id_mes:8}
        //             ],
                    
        //         },
        //         include: [
        //             {  association: 'salarioplanilla_empleado',  attributes: [
        //                 'uuid', 
        //                 [sequelize.fn('CONCAT', sequelize.col('salarioplanilla_empleado.nombre'), '  ', sequelize.col('paterno'), '  ', sequelize.col('materno')), 'nombre_completo'],
        //                 [sequelize.fn('CONCAT', sequelize.col('numero_documento'), '  ', sequelize.col('complemento')), 'numdocumento_completo'],
                    
        //             ],}, 
        //             { association: 'salarioplanilla_asignacioncargoemp',  attributes: [
        //                 'id', 'fecha_inicio', 'fecha_limite', 'ingreso', 'retiro', 'id_reparticion', 'id_destino'],
        //                 include:[
        //                     { association: 'asignacioncargoemp_cargo' },
        //                 //    { association: 'asignacioncargoemp_reparticion', attributes:['nombre'] },
        //                 //    { association: 'asignacioncargoemp_destino', attributes:['nombre'] },
        //                 ],
        //             },
    
        //             // { association: 'asistencia_cargo',  attributes: ['descripcion'],}, 
        //             { association: 'salarioplanilla_mes',  attributes: ['mes_literal', 'fecha_inicio', 'fecha_limite'],}, 
        //         ],
        //         limit:100,
        //     }
        // );
        // const listaEmpleados = await Reparticion.findAll({
          
        //   //association: 'reparticion_organismo',
        //   where: { id_organismo: 1 },
        //   include: [
        //       {
        //         association: 'reparticion_asigCarEmp',
        //           // include: [
        //           //     {
        //           //       association: 'asignacioncargoemp_salarioplanilla',
        //           //         where: { id_mes: 8 },
        //           //         limit:100
        //           //     }
        //           // ],
        //           limit:100
        //       },
        //       {association: 'reparticion_organismo'},
        //       {association: 'reparticion_municipio'}
        //   ],

         
        
        // });
      //   const tituloTable = {
      //     style: 'tableExample',
			// table: {
      //   headerRows: 2,
      //   margin: [0, 0, 0, 10],
      //   widths: [320, 320, 100, 150],
			// 	body: [
			// 		[{text:'Dirección Administrativa:',style:'titleheader',border: [false, false, false, false],},
      //     {text:'Unidad Ejecutora:',style:'titleheader',border: [false, false, false, false],},
      //     {text:'Coprobante:',style:'titleheader',border: [false, false, false, false],},
      //     {text:'Devengado:',style:'titleheader',border: [false, false, false, false],}
      //     ],
      //     [{text:'Ministerio de defenza',style:'textheader'},
      //     {text:'administracion central',style:'textheader'},
      //     {text:'',style:'textheader'},
      //     {text:'',style:'textheader'}
      //     ],
             
			// 	]
			// }
      //   };
      //   docDefinition.content.push(tituloTable);

        // const headerTable = {   
        //   margin: [0, 50, 0, 0],      
        //   style: 'tableExample',
        //   table: {
        //     headerRows: 1,
        //     widths: [30, 25, 25, 120, 10,  12,12,  23,23,23,23,23,23,  23,23,23,23,23 ,107,  23,23,23,23,23],
        //     body: [
        //       [{text:'Organismo Repartición Dept',style:'subheaderT'},
        //       {text:'Código', style:'subheaderT' },
        //       {text:'Doc. Id',style:'subheaderT'},
        //       {text:'Nombre',style:'subheaderT'},
        //       {text:'DT',style:'subheaderT'},
              
        //       {text:'Banco',style:'subheaderT'},
        //       {text:'Fte Org',style:'subheaderT'},

        //       {text:'Total Gando',style:'subheaderT'},
        //       {text:'Haber Básico',style:'subheaderT'},
        //       {text:'Bono Antiguedad',style:'subheaderT'},
        //       {text:'Bono Frontera',style:'subheaderT'},
        //       {text:'Bono Militares',style:'subheaderT'},
        //       {text:'Otros Ingresos',style:'subheaderT'},

        //       {text:'Renta de vejez',style:'subheaderT'},
        //       {text:'Riesgo común',style:'subheaderT'},
        //       {text:'Comisión',style:'subheaderT'},
        //       {text:'Aporte Sol. Ase',style:'subheaderT'},
        //       {text:'Aporte Nal. Sol',style:'subheaderT'},

        //       {
        //         margin: [-5, -3, 0, -3],
        //         style: 'subheaderT',
        //         table: {
        //           widths: [20,20,20,20],
        //           //heights: 40,
        //           body: [
        //             [{ text: 'Patronales', colSpan: 4, alignment: 'center',border: [false, false, false, true] }, {}, {},{}],
        //             [{ text: 'Riesgo Profes', border: [false, false, true, false] }, { text: 'Caja de Salud', border: [false, false, true, false] }  ,
        //              { text: 'Ap Pat Vivienda', border: [false, false, true, false] }, { text: 'Ap Pat SOL', border: [false, false, false, false] } ],
                    
        //           ]
        //         }
        //       },

        //       {text:'Dscto Impsto',style:'subheaderT'},
        //       {text:'Otros Dsctos',style:'subheaderT'},
        //       {text:'Subsidio',style:'subheaderT'},
        //       {text:'Liquido Pagable',style:'subheaderT'},
        //       {text:'Liq. Pag Acum',style:'subheaderT'},
        //     ],
              
                
        //     ]
        //   }

        // };
        // docDefinition.content.push(headerTable);

        const listaEmpleados = await Municipio.findAll({
          include: [
            {
              model: Reparticion,
              as: 'municipio_reparticion', // Alias para la relación
              where: {
                id_organismo: 2, nombre:'CMDO.5TA.DIV.'
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
                        id_mes: 8
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
        //console.log("lista:",listaEmpleados);
        

        //console.log("name File Tempo",nameFileTempo);
        const nameFile = 'planilla.pdf';//`${uuidv4()}.pdf`;
        const outputFileName = 'public/upload/'+nameFile;
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

        // Guardar el PDF en el sistema de archivos
        pdfDoc.getBuffer((buffer) => {
            //fs.writeFileSync(outputFileName, buffer);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=reporte_empleados.pdf');
            res.send(buffer);

            //console.log('PDF generado con éxito');
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
    newReport
    //updateAporte,
    //activeInactiveAporte
};