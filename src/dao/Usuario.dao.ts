import { conexao } from "../util/conexao";
import { Usuario } from "../modelo/Usuario";
import { error } from "node:console";
export class UsuarioDao {
    public async salvar(usuario:Usuario){
        try{
            const [rows]:any = await conexao.query(
                'insert into usuarios (nome,email,senha_hash) values (?,?,?)',
                [usuario.nome,usuario.email,usuario.senhaHash]
            )
        }
        catch(error){
            console.log(error)
            throw new Error("Erro ao Salvar Usuário")
        }
        

    }
    public async buscarPorId(id:number): Promise <Usuario|null>{
        try{
            const [rows]: any = await conexao.query(
                'select * from usuarios where id = ?',
                [id]
            )
            if(rows.length===0){
                console.log("Nenhum usuário encontrado")
                return null
            }
            const usuario = Usuario.reconstruir({
                id: rows[0].id,
                nome: rows[0].nome,
                email: rows[0].email,
                senhaHash: rows[0].senha_hash
            })
            return usuario

        }
        catch(error){
            console.log(error)
            throw new Error ("Erro ao buscarUsuario")
        }

        
    }
   public async listar(): Promise<any[]> {
    try {
        const [rows]: any = await conexao.query(
            "SELECT id, nome, email FROM usuarios"
        );

        return rows.map((r: any) => ({
            id: r.id,
            nome: r.nome,
            email: r.email
        }));

    } catch (error) {
        console.error(error);
        throw new Error("Erro ao listar Usuários");
    }
}
    public async atualizar(usuario:Usuario): Promise<void> {
        try{
            const [result]: any = await conexao.query(
                'update usuarios set nome = ?, email = ? where id =? ',
                [usuario.nome, usuario.email,usuario.id]
            ) 
            if(result.affectedRows===0){
                // affectedRows = 0 também ocorre quando nada mudou,
                // então confirma a existência antes de tratar como erro.
                const [existe]: any = await conexao.query(
                    'select id from usuarios where id = ?',
                    [usuario.id]
                )
                if(existe.length===0){
                    throw new Error("Usuario não encontrado")
                }
            }
        }
        catch(error){
            console.log(error)
            throw new Error("Erro ao atualizar o Usuário")
        }
    }
    public async deletar(id:number): Promise <void>{
        try{
            const [result]: any = await conexao.query(
                'delete from usuarios where id =?',
                [id]

            )
            if(result.affectedRows===0){
                throw new Error ("Não foi possivel excluir o usuário")
            }
        }
        catch(error){
            console.log(error)
            throw new Error("Erro ao excluir o Usuário")
            
        }

    }
    public async login(email: string): Promise<Usuario | null> {
    try {
        const [rows]: any = await conexao.query(
            "SELECT * FROM usuarios WHERE email = ?",
            [email]
        );

        console.log("ROWS:", rows);
        console.log("PRIMEIRO USUARIO:", rows[0]);

        if (rows.length === 0) {
            return null;
        }

        const usuario = Usuario.reconstruir({
            id: rows[0].id,
            nome: rows[0].nome,
            email: rows[0].email,
            senhaHash: rows[0].senha_hash
        });

        console.log("USUARIO CRIADO:", usuario);
        console.log("SENHA HASH:", usuario.senhaHash);

        return usuario;

    } catch (error) {
        console.error(error);
        throw error;
    }
}
    
    
}