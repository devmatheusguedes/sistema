/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { ProductService } from '../../../../demo/service/ProductService';
import { Projeto} from '@/types';
import { UsuarioService } from '@/service/UsuarioService';
import { error } from 'console';

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const Crud = () => {
    let usuarioVazio: Projeto.usuario = {
        id: 0,
        nome: '',
        email:'',
        senha: '',
        login: ''

    }


    const [usuarios, setUsuarios] = useState<Projeto.usuario[]>([]);
    const [usuarioDialog, setUsuarioDialog] = useState(false);
    const [deleteUsuarioDialog, setDeleteUsuarioDialog] = useState(false);
    const [deleteUsuariosDialog, setDeleteUsuariosDialog] = useState(false);
    const [usuario, setUsuario] = useState<Projeto.usuario>(usuarioVazio);
    const [selectedUsuarios, setSelectedUsuarios] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const usuarioService = new UsuarioService();

    useEffect(() => {
        if(usuarios.length == 0){
        usuarioService.listarTodos().then((response)=>{
            console.log(response.data);
            setUsuarios(response.data);
        }).catch((error) =>{
            console.log(error);
        });
    }
    }, [usuarios]);

   

    const openNew = () => {
        setUsuario(usuarioVazio);
        setSubmitted(false);
        setUsuarioDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setUsuarioDialog(false);
    };

    const hideDeleteUsuarioDialog = () => {
        setDeleteUsuarioDialog(false);
    };

    const hideDeleteUsuariosDialog = () => {
        setDeleteUsuarioDialog(false);
    };

    const saveUsuario = () => {
         setSubmitted(true);

         if(!usuario.id){
            usuarioService.inserir(usuario)
            .then((response)=>{
                setUsuarioDialog(false);
                setUsuario(usuarioVazio);
                setUsuarios([]);
                toast.current?.show({
                    severity : 'info',
                    summary : 'sucesso!',
                    detail : 'Usuario cadastrado com sucesso!'
                })
            })
            .catch((error) => {
                toast.current?.show({
                    severity : 'error',
                    summary : 'ERRO!',
                    detail : 'ocorreu um erro ao cadastrar o ususario '+error.data.message
                })
            })
         }else{
            usuarioService.alterar(usuario)
            .then((response) => {
                setUsuarioDialog(false);
                setUsuario(usuarioVazio);
                setUsuarios([]);
                toast.current?.show({
                    severity : 'info',
                    summary : 'sucesso!',
                    detail : 'Usuario alterado com sucesso!'
            });
            }).catch((error) => {
                toast.current?.show({
                    severity : 'error',
                    summary : 'ERRO!',
                    detail : 'ocorreu um erro ao alterar o ususario '});
            })
        }

      
    };

    const editUsuario = (usuario: Projeto.usuario) => {
        setUsuario({ ...usuario });
        setUsuarioDialog(true);
    };

    const confirmDeleteUsuario = (usuario: Projeto.usuario) => {
        setUsuario(usuario);
        setDeleteUsuarioDialog(true);
    };

    const deleteUsuario = () => {
        usuarioService.excluir(usuario.id).then((response) =>{
            setUsuario(usuarioVazio);
            setDeleteUsuarioDialog(false);
            setUsuarios([]);
            toast.current?.show({
                severity:'success',
                summary:'sucesso!',
                detail:'Usuario deletado com sucesso!',
                life:3000
            });
        }).catch((error) =>{
            toast.current?.show({
                severity:'error',
                summary:'Erro!',
                detail:'Erro ao deletar usuario!',
                life:3000 });
                       }
        )
      
       
    
     };
    

    const findIndexById = (id: number) => {
        let index = -1;
        for (let i = 0; i < (usuarios as any)?.length; i++) {
            if ((usuarios as any)[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    // const createId = () => {
    //     let id = '';
    //     let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    //     for (let i = 0; i < 5; i++) {
    //         id += chars.charAt(Math.floor(Math.random() * chars.length));
    //     }
    //     return id;
    // };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteUsuariosDialog(true);
    };

     const deleteSelectedUsuarios = () => {
    //     let _products = (usuarios as any)?.filter((val: any) => !(selectedUsuarios as any)?.includes(val));
    //     setProducts(_products);
    //     setDeleteProductsDialog(false);
    //     setSelectedProducts(null);
    //     toast.current?.show({
    //         severity: 'success',
    //         summary: 'Successful',
    //         detail: 'Products Deleted',
    //         life: 3000
    //     });
     };

    // const onCategoryChange = (e: RadioButtonChangeEvent) => {
    //     let _product = { ...product };
    //     _product['category'] = e.value;
    //     setProduct(_product);
    // };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _usuario = { ...usuario };
        _usuario[`${name}`] = val;

        setUsuario(_usuario);
    };

    // const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
    //     const val = e.value || 0;
    //     let _usuario = { ...usuario };
    //     _usuario[`${name}`] = val;

    //     setProduct(_product);
    // };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedUsuarios || !(selectedUsuarios as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const idBodyTemplate = (rowData: Projeto.usuario) => {
        return (
            <>
                <span className="p-column-title">codigo</span>
                {rowData.id}
            </>
        );
    };

    const nomeBodyTemplate = (rowData: Projeto.usuario) => {
        return (
            <>
                <span className="p-column-title">Nome</span>
                {rowData.nome}
            </>
        );
    };
    
    const loginBodyTemplate = (rowData: Projeto.usuario) => {
        return (
            <>
                <span className="p-column-title">Login</span>
                {rowData.login}
            </>
        );
    }; 
    const emailBodyTemplate = (rowData: Projeto.usuario) => {
        return (
            <>
                <span className="p-column-title">E-mail</span>
                {rowData.email}
            </>
        );
    };

    // const imageBodyTemplate = (rowData: Demo.Product) => {
    //     return (
    //         <>
    //             <span className="p-column-title">Image</span>
    //             <img src={`/demo/images/product/${rowData.image}`} alt={rowData.image} className="shadow-2" width="100" />
    //         </>
    //     );
    // };

    // const priceBodyTemplate = (rowData: Demo.Product) => {
    //     return (
    //         <>
    //             <span className="p-column-title">Price</span>
    //             {formatCurrency(rowData.price as number)}
    //         </>
    //     );
    // };

    // const categoryBodyTemplate = (rowData: Demo.Product) => {
    //     return (
    //         <>
    //             <span className="p-column-title">Category</span>
    //             {rowData.category}
    //         </>
    //     );
    // };

    // const ratingBodyTemplate = (rowData: Demo.Product) => {
    //     return (
    //         <>
    //             <span className="p-column-title">Reviews</span>
    //             <Rating value={rowData.rating} readOnly cancel={false} />
    //         </>
    //     );
    // };

    // const statusBodyTemplate = (rowData: Demo.Product) => {
    //     return (
    //         <>
    //             <span className="p-column-title">Status</span>
    //             <span className={`product-badge status-${rowData.inventoryStatus?.toLowerCase()}`}>{rowData.inventoryStatus}</span>
    //         </>
    //     );
    // };

    const actionBodyTemplate = (rowData: Projeto.usuario) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editUsuario(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteUsuario(rowData)} />
            </>
        );
    };  
  
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gerenciamento de Usuarios</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const usuarioDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={saveUsuario} />
        </>
    );
    const deleteUsuarioDialogFooter = (
        <>
            <Button label="Nâo" icon="pi pi-times" text onClick={hideDeleteUsuarioDialog} />
            <Button label="sim" icon="pi pi-check" text onClick={deleteUsuario} />
        </>
    );
    const deleteUsuariosDialogFooter = (
        <>
            <Button label="Nâo" icon="pi pi-times" text onClick={hideDeleteUsuariosDialog} />
            <Button label="sim" icon="pi pi-check" text onClick={deleteSelectedUsuarios} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={usuarios}
                        selection={selectedUsuarios}
                        onSelectionChange={(e) => setSelectedUsuarios(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="mostrando {first} até {last} de {totalRecords} usuarios"
                        globalFilter={globalFilter}
                        emptyMessage="usuarios não encontrados."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="codigo" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="nome" header="Nome" sortable body={nomeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="login" header="Login" sortable body={loginBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="email" header="E-mail" sortable body={emailBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>

                        
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={usuarioDialog} style={{ width: '450px' }} header="Detalhes do Usuario" modal className="p-fluid" footer={usuarioDialogFooter} onHide={hideDialog}>
                    <div className="field">
                            <label htmlFor="nome">Name</label>
                            <InputText
                                id="nome"
                                value={usuario.nome}
                                onChange={(e) => onInputChange(e, 'nome')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !usuario.nome
                                })}
                            />
                            {submitted && !usuario.nome && <small className="p-invalid">Nome é obrigatório</small>}

                        </div> 

                        <div className="field">
                            <label htmlFor="login">Login</label>
                            <InputText
                                id="login"
                                value={usuario.login}
                                onChange={(e) => onInputChange(e, 'login')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !usuario.login
                                })}
                            />
                            {submitted && !usuario.login && <small className="p-invalid">Login é obrigatório</small>}

                        </div> 

                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <InputText
                                id="email"
                                value={usuario.email}
                                onChange={(e) => onInputChange(e, 'email')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !usuario.email
                                })}
                            />
                            {submitted && !usuario.email && <small className="p-invalid">E-mail é Obrigatório</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="senha">Senha</label>
                            <InputText
                                id="senha"
                                value={usuario.senha}
                                onChange={(e) => onInputChange(e, 'senha')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !usuario.senha
                                })}
                            />
                            {submitted && !usuario.senha && <small className="p-invalid">senha é Obrigatório</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteUsuarioDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUsuarioDialogFooter} onHide={hideDeleteUsuarioDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {usuario && (
                                <span>
                                    Você realmente deseja excluir o usuario <b></b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteUsuariosDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteUsuariosDialogFooter} onHide={hideDeleteUsuariosDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {usuario &&<span> Você realmente deseja excluir os usuarios selecionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
                            };
                            

export default Crud;