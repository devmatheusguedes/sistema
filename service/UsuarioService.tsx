import axios from "axios"


export const axiosinstance = axios.create({
    baseURL: "http://localhost:8080"// acessando o local onde o backend esta subindo
})

export class UsuarioService{
    listarTodos(){
        return axiosinstance.get("/usuario");// fazendo uma requisição do tipo get no local http:/localhost:8080/usuario
    }

    inserir(usuario : Projeto.usuario){
        return axiosinstance.post("/usuario", usuario);
    }

    alterar(usuario : Projeto.usuario){
        return axiosinstance.put("/usuario", usuario);
    }

    excluir(id : number){
        return axiosinstance.delete("/usuario/" + id);
        
    }
}