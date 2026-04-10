import { db } from "../src/lib/db";
import { hash } from "bcryptjs";
import crypto from "crypto";

const employeePhones: Record<string, string> = {
  "Аверкина Ирина Александровна": "79064236186",
  "Аветян Асмик Арменовна": "79614315250",
  "Бартенева Мариса Никитична": "79381800540",
  "Вишнякова Анастасия Алексеевна": "79604690784",
  "Гаташев Михаил Геннадьевич": "79094064330",
  "Гребенникова Арина Андреевна": "79281213182",
  "Гусева Дарья Федоровна": "79289003520",
  "Гуськова Татьяна Эдуардовна": "79604442979",
  "Гуцул Андрей Павлович": "79094404507",
  "Егорова Татьяна Игоревна": "79281105965",
  "Жирова Светлана Андреевна": "79094404807",
  "Казанкова Ксения Александровна": "79281104035",
  "Ковалева Татьяна Александровна": "79289005620",
  "Ковалёва Татьяна Александровна": "79289005620",
  "Кузьменко Анна Дмитриевна": "79054265290",
  "Кучма Ольга Сергеевна": "79381600940",
  "Лазуренко Наталья Владимировна": "79614255488",
  "Лахина Дарья Алексеевна": "79604690781",
  "Лившиц Анастасия Валерьевна": "79054595913",
  "Медведева Ксения Сергеевна": "79281105020",
  "Недопекина Алия Алексеевна": "79613230063",
  "Недопёкина Алия Алексеевна": "79613230063",
  "Николаева Виолетта Витальевна": "79094404107",
  "Овчаренко Светлана Николаевна": "79281143130",
  "Овчарова Ольга Павловна": "79054265654",
  "Письменская Татьяна Витальевна": "79613230062",
  "Пичкалева Элина Олеговна": "79604690787",
  "Рокачева Юлия Андреевна": "79054595958",
  "Рыжиков Владлен Владиславович": "79614389060",
  "Сижажева Ангелина Назимовна": "79604446107",
  "Страдецкая Александра Константиновна": "79604690785",
  "Тевосян Светлана Михайловна": "79054595916",
  "Федотова Диана Владимировна": "79054595928",
  "Хасанова Луиза Руслановна": "79094402307",
  "Чебан Елена Петровна": "79064235034",
  "Шевцова Инесса Акоповна": "79613230065",
};

function generatePassword() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let pass = "";
  for (let i = 0; i < 6; i++) {
    pass += chars.charAt(crypto.randomInt(0, chars.length));
  }
  return pass;
}

async function main() {
  const users = await db.user.findMany();
  console.log(`Found ${users.length} users. Starting update...`);

  for (const user of users) {
    if (user.fullName === "Главный Администратор") {
      console.log(`Skipping admin ${user.fullName}`);
      continue;
    }

    const newPhone = employeePhones[user.fullName];
    const plainPassword = generatePassword();
    const hashedPassword = await hash(plainPassword, 12);

    const data: any = {
      password: hashedPassword,
      plainPassword: plainPassword,
    };

    if (newPhone) {
      data.phone = newPhone;
      console.log(`Updating ${user.fullName}: New Phone ${newPhone}, Password ${plainPassword}`);
    } else {
      console.log(`Updating ${user.fullName}: Password ${plainPassword} (Phone remains ${user.phone})`);
    }

    await db.user.update({
      where: { id: user.id },
      data,
    });
  }

  // Check if any employees from list are NOT in the database
  const existingNames = new Set(users.map(u => u.fullName));
  for (const [name, phone] of Object.entries(employeePhones)) {
    if (!existingNames.has(name) && name !== "Ковалёва Татьяна Александровна" && name !== "Недопёкина Алия Алексеевна") {
       // Only creation if absolutely not there
       console.log(`Creating missing user: ${name} with phone ${phone}`);
       const plainPassword = generatePassword();
       const hashedPassword = await hash(plainPassword, 12);
       await db.user.create({
         data: {
           fullName: name,
           phone: phone,
           password: hashedPassword,
           plainPassword: plainPassword,
           role: "EMPLOYEE"
         }
       });
    }
  }

  console.log("Update completed successfully.");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
