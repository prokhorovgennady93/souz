
import { PrismaClient } from '../src/generated/client'
import * as XLSX from 'xlsx'
import * as path from 'path'

// Настройка пути к базе данных явно
process.env.DATABASE_URL = 'file:../prisma/dev.db'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Чтение данных пользователей из базы данных...')
    
    // Получаем всех пользователей
    const users = await prisma.user.findMany({
      orderBy: { fullName: 'asc' }
    })

    console.log(`Найдено пользователей: ${users.length}`)

    if (users.length === 0) {
      console.log('Пользователи не найдены в базе данных.')
      return
    }

    const data = users.map((user: any) => {
      // Пытаемся получить plainPassword, если его нет - ищем в других местах или оставляем пометку
      let passwordToDisplay = user.plainPassword;
      
      if (!passwordToDisplay) {
        // Если plainPassword пуст, возможно это старая запись или админ.
        // Для админа из сида пароль был "12345678" (судя по seed-users.ts)
        if (user.phone === '79613002646') {
          passwordToDisplay = '12345678 (admin)';
        } else {
          passwordToDisplay = 'Не указан (только хеш)';
        }
      }

      return {
        'ФИО': user.fullName,
        'Телефон': user.phone,
        'Пароль': passwordToDisplay
      };
    })

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Сотрудники')

    const outputPath = path.join(process.cwd(), 'employees_passwords.xlsx')
    XLSX.writeFile(workbook, outputPath)

    console.log(`Данные успешно выгружены в файл: ${outputPath}`)
    
    // Выведем первые несколько для проверки
    console.log('Пример данных (первые 3):')
    console.table(data.slice(0, 3))
    
  } catch (error) {
    console.error('Ошибка при выгрузке данных:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
