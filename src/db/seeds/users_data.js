// /**
//  * @param { import("knex").Knex } knex
//  * @returns { Promise<void> }
//  */
// exports.seed = async function (knex) {
//   // Deletes ALL existing entries
//   await knex("users").del();
//   await knex("users").insert([
//     {
//       username: "nayanp",
//       password: "nayan1234",
//       email: "nayan@gmail.com",
//       first_name: "Nayan",
//       last_name: "Prajapati",
//       gender: "Male",
//       birthday: "1999-11-09",
//     },
//     // {
//     //   username: "ethanInniss",
//     //   email: "ethan@gmail.com",
//     //   password: "ilovesoccer",
//     //   first_name: "Ethan",
//     //   last_name: "Inniss",
//     //   gender: "Male",
//     //   date_of_birth: "2001-11-01",
//     // },
//     // {
//     //   email: "harry@gmail.com",
//     //   password: "harry1234",
//     //   username: "harrypotter",
//     //   first_name: "Harry",
//     //   last_name: "Potter",
//     //   gender: "Male",
//     //   date_of_birth: "2000-11-01",
//     // },
//     // {
//     //   email: "luis@gmail.com",
//     //   password: "luis123",
//     //   username: "luisc",
//     //   first_name: "Luis",
//     //   last_name: "Cordero",
//     //   gender: "Male",
//     //   date_of_birth: "1999-09-01",
//     // },
//   ]);
// };
