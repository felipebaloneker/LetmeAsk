import logoImg from '../../assets/images/logo.svg';
import { Button } from '../../components/Button';
import { RoomCode } from '../../components/RoomCode';
import { useParams } from 'react-router';

import { FormEvent, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { database } from '../../services/firebase';
import { Question } from '../../components/Question';
import { useRoom } from '../../hooks/useRoom';


type RoomParams = {
    id: string;
}

export function AdminRoom(){
    //Pegando o Id da Sala
    const params = useParams<RoomParams>();
    const roomId = params.id
    const {title, questions} = useRoom(roomId)

    // Pegando Informação da Pergunta
    const {user} = useAuth();
    const [newQuestion, setNewQuestion] = useState('');


    async function handleSendQuestion(event: FormEvent){
        event.preventDefault();

        if(newQuestion.trim() === ''){
            return;
        }
        if(!user){
            throw new Error("You must be logged in");
        }
        const question = {
            content: newQuestion,
            author:{
                name:user.name,
                avatar: user.avatar,
            },
            isHighlighted: false,
            isAnswered: false,
        };
        // Adicionando pergunta ao banco
        await database.ref(`rooms/${roomId}/questions`).push(question);

        // Limpando o Input
        setNewQuestion('');
    }

    return(
       <div id='page-room'>
           <header>
               <div className="content">
                   <img src={logoImg} alt="Letmeask"/>
                   <div>
                    <RoomCode code={roomId}/>
                    <Button isOutlined>Encerrar Sala</Button>
                   </div>
               </div>
           </header>

           <main>
               <div className='room-title'>
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
               </div>

            {/* Mostrando Perguntas em Tela */}
            <div className='question-list'>
                {questions.map(question =>{
                    return(
                        <Question
                        key={question.id}
                        content={question.content}
                        author={question.author}
                        />
                    );
                })}
            </div>
           </main>
       </div>
    )
}