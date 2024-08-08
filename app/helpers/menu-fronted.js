const getMenuFrontend = (role = 'OPERADOR') => {
  
    if(role === 'ADMINISTRADOR' || role === 'DESARROLLADOR') return getMenuRolAdmin();
    if(role === 'USUARIO') return getMenuRolUsuario();
    if(role === 'CONSULTOR') return getMenuRolConsultor();
    return [];
  }
  
  const getMenuRolAdmin = () => {
    return [
      { 
        title: 'Dashboard',
        url: '/capacitacion/home',
        icon: 'home',
      },
      { 
        title: 'Cursos',
        url: '/capacitacion/curso',
        icon: 'school',
      },
      { 
        title: 'Capacitaciones',
        url: '/capacitacion/capacitacion',
        icon: 'reduce_capacity',
      },
      { 
        title: 'Funcionario',
        url: '/capacitacion/funcionario',
        icon: 'person',
      },
      { 
        label: 'Principal',
        items:[
          { label: 'Principal', icon: 'pi pi-fw pi-home', routerLink: ['/capacitacion/home'] }
        ],
      },
      { 
        label: 'Cursos',
        items:[
          { label: 'Cursos', icon: 'pi pi-fw pi-book', routerLink: ['/capacitacion/cursos'] }
        ],        
      },
      { 
        label: 'Capacitaciones',
        items:[
          { label: 'Capacitaciones', icon: 'pi pi-fw pi-id-card', routerLink: ['/capacitacion/capacitacion'] }
        ],                
      },
      { 
        label: 'Funcionario',
        items:[
          { label: 'Funcionario', icon: 'pi pi-fw pi-user', routerLink: ['/capacitacion/funcionario'] }
        ],                
        
      },
      
      // { 
      //   title: 'Funcionario',
      //   url: '/capacitacion/funcionario',
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
          { label: 'Principal', icon: 'pi pi-fw pi-home', routerLink: ['/capacitacion/home'] }
        ],
      },
      { 
        label: 'Capacitaciones',
        items:[
          { label: 'Capacitacion', icon: 'pi pi-fw pi-id-card', routerLink: ['/capacitacion/capacitacion/usuario'] }
        ],                
      },
      
      { 
        title: 'Dashboard',
        url: '/capacitacion/home',
        icon: 'home',
      },
      { 
        title: 'Capacitaciones',
        url: '/capacitacion/capacitacion/usuario',
        icon: 'school',
      },
      { 
        title: 'Curso',
        url: '/capacitacion/curso/empleado',
        icon: 'history_edu',
      },
      ];

    // return [
      
    //   { 
    //     title: 'Capacitaciones',
    //     url: '/capacitacion/capacitacion/usuario',
    //     icon: 'school',
    //   },
    //   { 
    //     title: 'Curso',
    //     url: '/capacitacion/curso/empleado',
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