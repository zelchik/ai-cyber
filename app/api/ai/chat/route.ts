import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import OpenAI from "openai"


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})


export async function POST(req: NextRequest) {

  try {

    const { message, history = [] } = await req.json()


    // 1. AI визначає дію

    const analysis = await openai.chat.completions.create({

      model: "gpt-4o-mini",

      messages: [
        {
          role: "system",
          content: `
Ти AI Planner.

Визнач тип запиту користувача.

Відповідай тільки JSON:

{
"type":"task" | "habit" | "note" | "chat",
"title":"текст",
}

Приклади:

"створи задачу купити молоко"
=
{
"type":"task",
"title":"купити молоко"
}

"додай звичку пити воду"
=
{
"type":"habit",
"title":"пити воду"
}

"запиши ідею"
=
{
"type":"note",
"title":"ідея"
}

Якщо просто питання:
{
"type":"chat",
"title":""
}
`
        },

        {
          role:"user",
          content:message
        }

      ],

      response_format:{
        type:"json_object"
      }

    })


    const action = JSON.parse(
      analysis.choices[0].message.content || "{}"
    )



    // 2. Створюємо задачу

    if(action.type === "task") {


      const task = await prisma.task.create({

        data:{
          title: action.title,
          completed:false,
          userId:"demo-user"
        }

      })


      return NextResponse.json({

        reply:
        `✅ Створив задачу: ${task.title}`

      })

    }

    // 3. Створюємо звичку

if (action.type === "habit") {
  const habit = await prisma.habit.create({
    data: {
      title: action.title,
      completed: false,
      userId: "demo-user",
    },
  })

  return NextResponse.json({
    reply: `⚡ Створив звичку: ${habit.title}`,
  })
}



    // 4. Створюємо нотатку

    if(action.type === "note") {


      await prisma.note.create({

        data:{
          content: action.title,
          userId:"demo-user"
        }

      })


      return NextResponse.json({

        reply:
        `📝 Зберіг нотатку: ${action.title}`

      })

    }



    // 5. Звичайна відповідь AI


    const chat = await openai.chat.completions.create({

      model:"gpt-4o-mini",

      messages:[
        {
          role:"system",
          content:
          "Відповідай українською як AI Planner."
        },

        ...history,

        {
          role:"user",
          content:message
        }
      ]

    })


    return NextResponse.json({

      reply:
      chat.choices[0].message.content

    })


  }

  catch(error){

    console.error(error)

    return NextResponse.json({

      error:"Помилка сервера"

    },{
      status:500
    })

  }

}