const getMenuFrontend = (role = 'OPERADOR') => {
  
    if(role === 'ADMINISTRADOR' || role === 'DESARROLLADOR') return getMenuRolAdmin();
    if(role === 'USUARIO') return getMenuRolUsuario();
    if(role === 'CONSULTOR') return getMenuRolConsultor();
    return [];
  }
  
  const getMenuRolAdmin = () => {
    return [
      { 
        //label: 'Principal',
        items:[
          { label: 'Principal', icon: 'pi pi-fw pi-home', routerLink: ['/salarios/home'] }
        ],
      },
      {
        items: [          
          {
            label: 'Planilla', icon: 'pi pi-fw pi pi-copy',
            items: [
              {
                label: 'Planilla Items', icon: 'pi pi-fw pi-play',routerLink: ['/salarios/planilla/planillaMeses/tipo/planilla']
              },
              
            ]
          },            
        ]
      },
      {
        items: [          
          {
            label: 'Empleado', icon: 'pi pi-users',
            items: [
              {
                label: 'Asignacion Cargo', icon: 'pi pi-user-edit',routerLink: ['/salarios/empleado/asignacionCargoEmp']
              },
              {
                label: 'Empleado', icon: 'pi pi-user-plus',routerLink: ['/salarios/empleado/empleado/tipo/EMPLEADO']
              },
              {
                label: 'Grado', icon: 'pi pi-pause',routerLink: ['/salarios/empleado/grado']
              },
              {
                label: 'Lugar Expedido', icon: 'pi pi-globe',routerLink: ['/salarios/empleado/lugar_exp']
              },
            ]
          },            
        ]
      },
      {
        items: [          
          {
            label: 'Descuentos', icon: 'pi pi-fw pi-wallet',
            items: [
              {
                label: 'Descuento Emp.', icon: 'pi pi-fw pi-user',routerLink: ['/salarios/asignacion_descuento/tipo/descuento'],routerLinkActiveOptions:{ exact: false },routerLinkActive:"active"
              },
              {
                label: 'Tipo desc.', icon: 'pi pi-fw pi-calendar',routerLink: ['/salarios/descuento/tipo/DESCUENTOS'] //TIPO = AFPS-EDAD
              },
              
          ]
          },            
        ]
      },
      {
        items: [          
          {
            label: 'Sanciones', icon: 'pi pi-fw pi-credit-card',
            items: [
              {
                label: 'Sancion Emp.', icon: 'pi pi-fw pi-user',routerLink: ['/salarios/asignacion_sancion/tipo/sancion'],routerLinkActiveOptions:{ exact: false },routerLinkActive:"active"
              },
              {
                label: 'Tipo San.', icon: 'pi pi-fw pi-calendar',routerLink: ['/salarios/sancion/tipo/SANCIONES'] //TIPO = AFPS-EDAD
              },
              
          ]
          },            
        ]
      },
      {
        items: [          
          {
            label: 'Subsidio', icon: 'pi pi-fw pi-credit-card',
            items: [
              {
                label: 'Subsidio Emp.', icon: 'pi pi-fw pi-user',routerLink: ['/salarios/asignacion_subsidio/tipo/subsidio'],routerLinkActiveOptions:{ exact: false },routerLinkActive:"active"
              },
              {
                label: 'Tipo San.', icon: 'pi pi-fw pi-calendar',routerLink: ['/salarios/subsidio/tipo/subsidio'] //TIPO = AFPS-EDAD
              },
              
          ]
          },            
        ]
      },
      {
        items: [          
          {
            label: 'Antiguedad Y bono', icon: 'pi pi-fw pi-ticket',
            items: [
              {
                label: 'Asignacion Emp', icon: 'pi pi-fw pi-calendar',routerLink: ['/salarios/asignacion_bono/tipo','bono-empleado'], routerLinkActiveOptions:{ exact: false },routerLinkActive:"active" //TIPO = antiguedad
              },
              {
                label: 'Tipo de Bono', icon: 'pi pi-fw pi-calendar',routerLink: ['/salarios/bono/tipo'] //TIPO = antiguedad
              },
              {
                label: 'Fecha Limite Años antiguedad', icon: 'pi pi-fw pi-calendar',routerLink: ['/salarios/afp/fechas/ANTIGUEDAD'] //TIPO = antiguedad
              },
            ]
          },            
        ]
      },
      {
        items: [          
          {
            label: 'AFPs  y Aporte Nacional', icon: 'pi pi-fw pi-percentage',
            items: [
              {
                label: 'Calificacion Emp.', icon: 'pi pi-fw pi-user',routerLink: ['/salarios/afp/calificacion']
              },
              {
                label: 'Fecha Limite c/ edad', icon: 'pi pi-fw pi-calendar',routerLink: ['/salarios/afp/fechas/AFPS-EDAD'] //TIPO = AFPS-EDAD
              },
              
          ]
          },            
        ]
      },

      {
        items: [          
          {
            label: 'RC-IVA', icon: 'pi pi-fw pi-dollar',
            items: [
              {
                label: 'Empleado', icon: 'pi pi-fw pi-user',routerLink: ['/salarios/rc_iva/tipo', 'rciva']
              },
              {
                label: 'Fecha', icon: 'pi pi-fw pi-calendar',routerLink: ['/salarios/rciva/fechas/RC-IVA'] //TIPO =RC-IVA
              },
              {
                label: 'Ufv', icon: 'pi pi-fw pi-vimeo',routerLink: ['/salarios/rciva/ufvs']
              },
          ]
          },            
        ]
      },
      {
        items: [          
          {
            label: 'Salario', icon: 'pi pi-fw pi-shopping-bag',
            items: [
              {
                label: 'Incremento', icon: 'pi pi-fw pi-user',routerLink: ['/salarios/salario/incremento']
              },
              {
                label: 'Cargo', icon: 'pi pi-fw pi-eject',routerLink: ['/salarios/salario/cargo']
              },
              {
                label: 'Tipo Movimiento', icon: 'pi pi-fw pi-arrows-h',routerLink: ['/salarios/salario/tipomov']
              },
              {
                label: 'Categoria', icon: 'pi pi-fw pi-dollar',routerLink: ['/salarios/salario/categoria']
              },
          ]
          },            
        ]
      },
      {
        items:[
          {
            label: 'Gestion y Mes', icon: 'pi pi-fw pi-calendar-plus',routerLink: ['/salarios/gestion']
          },
        ],        
      },
      

      // { 
      //   title: 'Cursos',
      //   url: '/salarios/curso',
      //   icon: 'school',
      // },
      // { 
      //   title: 'Capacitaciones',
      //   url: '/salarios/capacitacion',
      //   icon: 'reduce_capacity',
      // },
      // { 
      //   title: 'Funcionario',
      //   url: '/salarios/funcionario',
      //   icon: 'person',
      // },
      // { 
      //   label: 'Principal',
      //   items:[
      //     { label: 'Principal', icon: 'pi pi-fw pi-home', routerLink: ['/salarios/home'] }
      //   ],
      // },
      // { 
      //   label: 'Cursos',
      //   items:[
      //     { label: 'Cursos', icon: 'pi pi-fw pi-book', routerLink: ['/salarios/cursos'] }
      //   ],        
      // },
      // { 
      //   label: 'Capacitaciones',
      //   items:[
      //     { label: 'Capacitaciones', icon: 'pi pi-fw pi-id-card', routerLink: ['/salarios/capacitacion'] }
      //   ],                
      // },
      // { 
      //   label: 'Funcionario',
      //   items:[
      //     { label: 'Funcionario', icon: 'pi pi-fw pi-user', routerLink: ['/salarios/funcionario'] }
      //   ],                
        
      // },
      
      // { 
      //   title: 'Funcionario',
      //   url: '/salarios/funcionario',
      //   icon: 'person',
      // },
      // { 
      //   title: 'Cursos',
      //   icon: 'school',
      //   subMenu: [
      //     {
      //       title: 'Registro de cursos', 
      //       icon: 'playlist_add',
      //       url: '/curso',
      //     },
      //     {
      //       title: 'Lista capacitaciones', 
      //       icon: 'model_training',
      //       url: '/cursos/capacitaciones',
      //     },

      //   ]
      // },
      
      // { 
      //   title: 'Administración',
      //   icon: 'pi pi-cog',
      //   subMenu: [
      //     {
      //       title: 'Grupos de trabajo', 
      //       icon: 'fa-solid fa-users-viewfinder',
      //       url: 'admin/groupsjobs'
      //     },
      //     {
      //       title: 'Trabajadores', 
      //       icon: 'fa-solid fa-people-line',
      //       url: 'admin/workers'
      //     },
      //     {
      //       title: 'Areas', 
      //       icon: 'fa-solid fa-person-digging',
      //       url: 'admin/areas'
      //     },
      //     {
      //       title: 'Actividades', 
      //       icon: 'fa-solid fa-tags',
      //       url: 'admin/activities'
      //     },
      //     { 
      //       title: 'Usuarios', 
      //       icon: 'fa-solid fa-user-gear',
      //       url: 'admin/users'
      //     },
      //   ]
      // },
      // { 
      //   title: 'Acerca de',
      //   url: 'acerca-de',
      //   icon: 'fa-solid fa-circle-info',
      // },
    ];
  }
  
  const getMenuRolUsuario = () => {
    return [
      { 
        label: 'Principal',
        items:[
          { label: 'Principal', icon: 'pi pi-fw pi-home', routerLink: ['/salarios/home'] }
        ],
      },
      { 
        label: 'Capacitaciones',
        items:[
          { label: 'Capacitacion', icon: 'pi pi-fw pi-id-card', routerLink: ['/salarios/capacitacion/usuario'] }
        ],                
      },
      
      { 
        title: 'Dashboard',
        url: '/salarios/home',
        icon: 'home',
      },
      { 
        title: 'Capacitaciones',
        url: '/salarios/capacitacion/usuario',
        icon: 'school',
      },
      { 
        title: 'Curso',
        url: '/salarios/curso/empleado',
        icon: 'history_edu',
      },
      ];

    // return [
      
    //   { 
    //     title: 'Capacitaciones',
    //     url: '/salarios/capacitacion/usuario',
    //     icon: 'school',
    //   },
    //   { 
    //     title: 'Curso',
    //     url: '/salarios/curso/empleado',
    //     icon: 'history_edu',
    //   },
    //   // { 
    //   //   title: 'Consultas / Reportes',
    //   //   url: 'reports/assignments',
    //   //   icon: 'fa-solid fa-magnifying-glass',
    //   // },
    //   // { 
    //   //   title: 'Acerca de',
    //   //   url: 'acerca-de',
    //   //   icon: 'fa-solid fa-circle-info',
    //   // },
    // ];
  }
  
  const getMenuRolConsultor = () => {
    return [
      { 
        title: 'Consultas / Reportes',
        url: 'reports/assignments',
        icon: 'fa-solid fa-magnifying-glass',
      },
      { 
        title: 'Acerca de',
        url: 'acerca-de',
        icon: 'fa-solid fa-circle-info',
      },
    ];
  }
  
  module.exports = {
      getMenuFrontend
  }