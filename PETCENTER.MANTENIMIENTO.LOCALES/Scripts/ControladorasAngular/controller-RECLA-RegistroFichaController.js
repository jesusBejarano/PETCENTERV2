(function () {
    angular.module('api')
        .controller('RegistroFichaController',
            ['$scope', '$http', '$routeParams', '$timeout', 'Enum', 'ParseHtml', '$rootScope', 'Helpers', 'ServiciosConector', '$compile',
                function ($scope, $http, $routeParams, $timeout, Enum, ParseHtml, $rootScope, Helpers, ServiciosConector, $compile) {

                    $timeout(function () {
                        ponerFechas();
                        PonerFocoInicio();
                        if ($rootScope.DatosFormulario == undefined)
                            $rootScope.DatosFormulario = {};
                        if ($rootScope.DatosFormulario.DatosFicha == undefined)
                            $rootScope.DatosFormulario.DatosFicha = {};
                        if ($rootScope.DatosFormulario.DatosFichaCargaInicial == undefined)
                            $rootScope.DatosFormulario.DatosFichaCargaInicial = {};


                        var paramCodigoSolicitud = getUrlVars()["codigoSolicitud"];
                        if (paramCodigoSolicitud) {
                            $rootScope.DatosFormulario.DatosFicha.SolicitudFlagEditar = true;
                            $rootScope.DatosFormulario.DatosFicha.CodigoSolicitud = paramCodigoSolicitud;
                        }


                        var esEditar = $rootScope.DatosFormulario.DatosFicha.FichaFlagEditar;

                        $scope.FlagMostrarBotonAprobar = false;
                        if (esEditar) {
                            $scope.CargarDatosIniciales();
                            $scope.FlagMostrarBotonModificar = true;
                            $scope.FlagMostrarBotonHistorial = true;
                            $scope.FlagMostrarBotonDeshabilitar = true;
                            $scope.FlagMostrarBotonGuardar = false;
                            $scope.CargaEdicionSolicitud();
                            $scope.FlagEditing = false;
                            $scope.FlagMostrarDescargarCarga = true;
                            $scope.FlagMostrarDescargarSustento = true;
                            $scope.FlagMostrarDescargarDocumento = true;
                            //$scope.FlagMostrarBotonEnviar = true;
                            $scope.FlagMostrarCodigoReclamo = true;
                        } else {
                            $rootScope.DatosFormulario.DatosFicha = {};
                            $scope.CargarDatosIniciales();
                            $scope.FlagMostrarBotonGuardar = true;
                            $rootScope.DatosFormulario.DatosFicha.CodigoSolicitud = 0;
                            $scope.FlagEditing = true;

                            $scope.FlagMostrarCodigoSolicitud = false;
                        }

                        $rootScope.DatosFormulario.DatosFichaCargaInicial.HabilitadoNumeroSolicitud = "False";

                    });

                    $scope.CargarDatosIniciales = function () {

                        $.ajax({
                            url: "/Ficha/Index",
                            type: "POST",
                            headers: { __RequestVerificationToken: $('input[name=__RequestVerificationToken]').val() },
                            data: "",
                            dataType: "json",
                            cache: true,
                            async: false,
                            success: function (data) {
                                if (data) {
                                    $rootScope.DatosFormulario.DatosFichaCargaInicial.TipoMantenimiento = data.TipoMantenimiento;
                                    $rootScope.DatosFormulario.DatosFichaCargaInicial.Sede = data.Sede;
                                    $rootScope.DatosFormulario.DatosFichaCargaInicial.Area = data.Area;
                                }

                            }
                        });
                    };

                    $scope.CargaEdicionFicha = function () {
                        var param = parseInt($rootScope.DatosFormulario.DatosFicha.CodigoSolicitud);
                        $.ajax({
                            url: "/Ficha/ObtenerDetalleFicha",
                            type: "POST",
                            headers: { __RequestVerificationToken: $('input[name=__RequestVerificationToken]').val() },
                            data: "codigoSolicitud=" + param,
                            dataType: "json",
                            cache: true,
                            async: false,
                            success: function (data) {
                                if (data != null) {
                                    $rootScope.DatosFormulario.DatosFicha = data;
                                    for (i = 0; i < data.ListaMantenimiento.length; i++) {
                                        jQuery("#listaMantenimientos").jqGrid('addRowData', i + 1, data.ListaMantenimiento[i]);
                                    }
                                }

                            }
                        });
                    }

                    $scope.Deshabilitar_Click = function () {
                        if ($rootScope.DatosFormulario.DatosFicha.NumeroSolicitud > 0) {

                            MiConfirm("¿Está seguro de deshabilitar la ficha?.", function () {
                                var request = $rootScope.DatosFormulario.DatosFicha;
                                $.ajax({
                                    url: "/Ficha/DeshabilitarFicha",
                                    type: "POST",
                                    headers: { __RequestVerificationToken: $('input[name=__RequestVerificationToken]').val() },
                                    data: "request=" + JSON.stringify(request),
                                    dataType: "json",
                                    cache: true,
                                    async: false,
                                    success: function (data) {
                                        if (data.Result != null) {
                                            if (data.Result.Satisfactorio === true) {
                                                MiAlertOk("Se ha deshabilitado correctamente la ficha.", MiAlertOk_success);
                                                //$rootScope.Redirect("/#!/sistema/busqueda/buscar-tarifa-local/");
                                            }
                                            else {
                                                if (data.Result.Mensajes.length > 0) {
                                                    MiError(data.Result.Mensajes[0].Mensaje);
                                                }
                                                else {
                                                    MiError(data.Result.Mensaje);
                                                }
                                            }
                                        } else {
                                            MiAlert("Ocurrió un problema interno en el sistema.");
                                        }

                                    }
                                });


                            });
                        }
                    }

                    $scope.Modificar_Click = function () {
                        $scope.FlagMostrarBotonGuardar = true;
                        $scope.FlagEditing = true;
                        //   $scope.EditingGrillas();
                    };

                    $scope.Guardar_Click = function () {

                        var validacion = validacionesCamposGuardar();
                        if (validacion == false) {
                            return false;
                        }

                        guardarAux();
                    };

                    $("#btnGuardar").off('click').on('click', function () {
                        if ($rootScope.DatosFormulario.DatosFicha.NumeroSolicitud > 0) {
                            actualizar();
                        } else {
                            guardar();
                        }


                    });

                    function guardar() {

                        var validacion = validacionesCamposGuardar();
                        if (validacion == false) {
                            return false;
                        }
                        $rootScope.DatosFormulario.DatosFicha.ListaMantenimiento = $('#listaMantenimientos').jqGrid('getGridParam', 'data');
                        var request = $rootScope.DatosFormulario.DatosSolicitud;
                        $.ajax({
                            url: "/Ficha/RegistrarFicha",
                            type: "POST",
                            headers: { __RequestVerificationToken: $('input[name=__RequestVerificationToken]').val() },
                            data: "request=" + JSON.stringify(request),
                            dataType: "json",
                            cache: true,
                            async: false,
                            success: function (data) {
                                if (data.Result != null) {
                                    if (data.Result.Satisfactorio === true) {
                                        MiAlertOk("Se ha registrado correctamente la ficha.", MiAlertOk_success);
                                        //$rootScope.Redirect("/#!/sistema/busqueda/buscar-tarifa-local/");
                                    }
                                    else {
                                        if (data.Result.Mensajes.length > 0) {
                                            MiError(data.Result.Mensajes[0].Mensaje);
                                        }
                                        else {
                                            MiError(data.Result.Mensaje);
                                        }
                                    }
                                } else {
                                    MiAlert("Ocurrió un problema interno en el sistema.");
                                }

                            }
                        });

                    }
                    function actualizar() {

                        var validacion = validacionesCamposGuardar();
                        if (validacion == false) {
                            return false;
                        }
                        $rootScope.DatosFormulario.DatosFicha.ListaMantenimiento = $('#listaMantenimientos').jqGrid('getGridParam', 'data');
                        var request = $rootScope.DatosFormulario.DatosFicha;
                        $.ajax({
                            url: "/Ficha/ActualizarFicha",
                            type: "POST",
                            headers: { __RequestVerificationToken: $('input[name=__RequestVerificationToken]').val() },
                            data: "request=" + JSON.stringify(request),
                            dataType: "json",
                            cache: true,
                            async: false,
                            success: function (data) {
                                if (data.Result != null) {
                                    if (data.Result.Satisfactorio === true) {
                                        MiAlertOk("Se ha actualizado correctamente la ficha.", MiAlertOk_success);
                                        //$rootScope.Redirect("/#!/sistema/busqueda/buscar-tarifa-local/");
                                    }
                                    else {
                                        if (data.Result.Mensajes.length > 0) {
                                            MiError(data.Result.Mensajes[0].Mensaje);
                                        }
                                        else {
                                            MiError(data.Result.Mensaje);
                                        }
                                    }
                                } else {
                                    MiAlert("Ocurrió un problema interno en el sistema.");
                                }

                            }
                        });



                    }

                    function validacionesCamposGuardar() {
                        limpiarControlesValidacionEspeciales();
                        var salida = true;

                        if (validateForm("#RegistroFichaFrm") == false) {
                            salida = false;
                        }
                        if (!$rootScope.DatosFormulario.DatosFicha.Descripcion) {
                            $(".caja11.msgerror.Descripcion").html("Descripcion es requerido");
                            salida = false;
                        }
                        if (!$rootScope.DatosFormulario.DatosFicha.FechaSolicitud) {
                            $(".caja11.msgerror.FechaFicha").html("Fecha Ficha es requerido");
                            salida = false;
                        }
                        var lstMantenimientos = $('#listaMantenimientos').jqGrid('getGridParam', 'data');
                        if (lstMantenimientos.length === 0) {
                            $(".caja11.msgerror.ListaMantenimiento").html("Debe ingresar por lo menos un registro");
                            salida = false;
                        }


                        return salida;
                    }

                    function limpiarControlesValidacionEspeciales() {
                        $(".caja11.msgerror.Descripcion").html("");
                        $(".caja11.msgerror.FechaSolicitud").html("");
                        $(".caja11.msgerror.ListaMantenimiento").html("");
                    }

                    function obtenerRequestGuardar() {
                        //$rootScope.DatosFormulario.DatosSolicitud.ReclamoAdjuntoLista.push(objCarta);
                        $rootScope.DatosFormulario.DatosFicha.CodigoEstadoGeneral = "001"
                        $rootScope.DatosFormulario.DatosFicha.CodigoEstado = "001";
                        $rootScope.DatosFormulario.DatosFicha.Acccion = "I";
                        var listaMotivoReclamoGrabar = [];
                        var listaMotivoReclamo = $from($rootScope.DatosFormulario.DatosFicha.ListaMotivoReclamo).where("$idCheck==true").toArray();
                        for (var i = 0; i < listaMotivoReclamo.length; i++) {
                            var objTipoReclamoTmp = new Object();
                            objTipoReclamoTmp.CodigoReclamoMotivoReclamo = 0;
                            objTipoReclamoTmp.CodigoMotivoReclamo = listaMotivoReclamo[i].CodigoMotivoReclamo;
                            objTipoReclamoTmp.Accion = "I";
                            listaMotivoReclamoGrabar.push(objTipoReclamoTmp);
                        }


                        //EDICION RECLAMO
                        if ($rootScope.DatosFormulario.DatosFicha.CodigoReclamo > 0) {
                            var listaMotivoReclamoEdit = $rootScope.DatosFormulario.DatosFicha.ListaMotivoReclamoEdit;
                            if (listaMotivoReclamoEdit.length > 0) {
                                for (var c = 0; c < listaMotivoReclamoEdit.length; c++) {
                                    var band = false;
                                    for (var d = 0; d < listaMotivoReclamoGrabar.length; d++) {
                                        if (listaMotivoReclamoGrabar[d].CodigoMotivoReclamo == listaMotivoReclamoEdit[c].CodigoMotivoReclamo) {
                                            listaMotivoReclamoGrabar.splice(d, 1);
                                            band = true;
                                        }
                                    }
                                    if (!band) {
                                        var obtMotivoReclamo = new Object();
                                        obtMotivoReclamo.CodigoReclamoMotivoReclamo = listaMotivoReclamoEdit[c].CodigoReclamoMotivoReclamo;
                                        obtMotivoReclamo.CodigoMotivoReclamo = listaMotivoReclamoEdit[c].CodigoMotivoReclamo;
                                        obtMotivoReclamo.Accion = "D";
                                        listaMotivoReclamoGrabar.push(obtMotivoReclamo);
                                    }
                                }
                            }
                            $rootScope.DatosFormulario.DatosFicha.Acccion = "U";
                        }
                        //EDICION RECLAMO

                        $rootScope.DatosFormulario.DatosFicha.ListaMotivoReclamoGrabar = listaMotivoReclamoGrabar;

                    }

                    $scope.Salir_Click = function () {
                        window.location.href = '/Ficha/ConsultaFicha';
                    };
                    function MiAlertOk_success() {
                        window.location.href = '/Ficha/ConsultaFicha';
                    }

                    function getUrlVars() {
                        var vars = [], hash;
                        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
                        for (var i = 0; i < hashes.length; i++) {
                            hash = hashes[i].split('=');
                            vars.push(hash[0]);
                            vars[hash[0]] = hash[1];
                        }
                        return vars;

                    }

                    $scope.Modificar_Click = function () {
                        $scope.FlagMostrarBotonGuardar = true;
                        $scope.FlagMostrarBotonModificar = false;
                        $scope.FlagMostrarBotonDeshabilitar = false;
                        $scope.FlagEditing = true;
                        $scope.EditingGrillas();
                    };

                    $scope.Enter = function () {
                        $rootScope.EsEnter = true;
                        return false;
                    };

                    $("input").focusout(function () {
                        $rootScope.EsEnter = false;
                    });
                    $scope.AgregarMantenimiento_Click = function () {
                        var altura = 800;
                        getPopupResponsive({
                            formURL: "AgregarMantenimiento",
                            title: "Agregar Mantenimiento",
                            nombreDiv: "divPopupAgregarMantenimiento",
                            nombreGrid: "",
                            width: "800px",
                            height: altura,
                            params: {},
                            HideSelection: true,
                            multiSelect: false,
                            select: function (row) {
                                return true;
                            },
                            beforeShow: function (obj) {

                                $rootScope.hashPopup = $(obj).attr("mapurl");
                                $compile($("#divPopupAgregarMantenimiento"))($scope);
                            }
                        });
                    };

                    
                    $scope.BuscarMantenimiento_Click = function () {
                        var altura = 800;
                        getPopupResponsive({
                            formURL: "BuscarSolicitudFicha",
                            title: "Buscar Mantenimiento",
                            nombreDiv: "divPopupBuscarMantenimiento",
                            nombreGrid: "",
                            width: "800px",
                            height: altura,
                            params: {},
                            HideSelection: true,
                            multiSelect: false,
                            select: function (row) {
                                return true;
                            },
                            beforeShow: function (obj) {

                                $rootScope.hashPopup = $(obj).attr("mapurl");
                                $compile($("#divPopupBuscarMantenimiento"))($scope);
                            }
                        });
                    };


                    $scope.AgregarActividad_Click = function () {
                        var altura = 800;
                        getPopupResponsive({
                            formURL: "BuscarActividad",
                            title: "Buscar Actividad",
                            nombreDiv: "divPopupBuscarActividad",
                            nombreGrid: "",
                            width: "800px",
                            height: altura,
                            params: {},
                            HideSelection: true,
                            multiSelect: false,
                            select: function (row) {
                                return true;
                            },
                            beforeShow: function (obj) {

                                $rootScope.hashPopup = $(obj).attr("mapurl");
                                $compile($("#divPopupBuscarActividad"))($scope);
                            }
                        });
                    }; 

                    $scope.AgregarMateriales_Click = function () {
                        var altura = 800;
                        getPopupResponsive({
                            formURL: "BuscarMateriales",
                            title: "Buscar Materiales",
                            nombreDiv: "divPopupBuscarMateriales",
                            nombreGrid: "",
                            width: "800px",
                            height: altura,
                            params: {},
                            HideSelection: true,
                            multiSelect: false,
                            select: function (row) {
                                return true;
                            },
                            beforeShow: function (obj) {

                                $rootScope.hashPopup = $(obj).attr("mapurl");
                                $compile($("#divPopupBuscarMateriales"))($scope);
                            }
                        });
                    }; 


                    jQuery("#listaActividades").jqGrid({

                        datatype: "local",
                        colNames: ['Código', 'Descripción', 'Eliminar'],
                        colModel: [
                            { name: 'Codigo', index: 'Codigo', width: 220, align: "center" },
                            { name: 'Descripcion', index: 'Descripcion', width: 220, align: "center" },
                           {
                               name: 'Eliminar',
                               align: 'center',
                               sortable: false,
                               width: 250,
                               formatter: function (cellvalue, options, rowObject) {
                                   return "<div style='width:100%;padding-left:10px'>" +
                                     "<a style='cursor:pointer;width:100%'>" +
                                     "<button title='Eliminar'  onclick='Eliminar(" + options.rowId + ")' class='boton1Style botonpequenio'>" +
                                     "<img width='16' height='16' src='/Images/eliminar.png'></button></a></div>";
                               }
                           }
                        ],
                        shrinkToFit: false,
                        autowidth: true
                    });

                    jQuery("#listaMateriales").jqGrid({

                        datatype: "local",
                        colNames: ['Código', 'Descripción', 'Cantidad','Eliminar'],
                        colModel: [
                            { name: 'Codigo', index: 'Codigo', width: 220, align: "center" },
                            { name: 'Descripcion', index: 'Descripcion', width: 220, align: "center" },
                            { name: 'Cantidad', index: 'Cantidad', width: 220, align: "center" },
                           {
                               name: 'Eliminar',
                               align: 'center',
                               sortable: false,
                               width: 250,
                               formatter: function (cellvalue, options, rowObject) {
                                   return "<div style='width:100%;padding-left:10px'>" +
                                     "<a style='cursor:pointer;width:100%'>" +
                                     "<button title='Eliminar'  onclick='Eliminar(" + options.rowId + ")' class='boton1Style botonpequenio'>" +
                                     "<img width='16' height='16' src='/Images/eliminar.png'></button></a></div>";
                               }
                           }
                        ],
                        shrinkToFit: false,
                        autowidth: true
                    });
                    //  jQuery("#listaMantenimientos").jqGrid('navGrid', '#pagerlistaMantenimientos', { edit: false, add: false, del: false });

                }]);
})();