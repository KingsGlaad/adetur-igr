import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Criar municípios
  await Promise.all([
    prisma.municipality.create({
      data: {
        name: "São Simão",
        description:
          "Cidade histórica conhecida por suas tradições e festas culturais",
        coatOfArms: "https://example.com/sao-simao.png",
        attractions: {
          create: [
            {
              name: "Igreja Matriz",
              description: "Igreja histórica do século XIX",
              image: "https://example.com/igreja-matriz.png",
            },
            {
              name: "Parque Municipal",
              description: "Área verde com trilhas e área de lazer",
              image: "https://example.com/parque.png",
            },
          ],
        },
        events: {
          create: [
            {
              title: "Festa do Peão",
              description: "Tradicional festa com rodeio e shows",
              date: new Date("2024-08-15"),
              image: "https://example.com/festa-peao.png",
            },
          ],
        },
        guides: {
          create: [
            {
              name: "João Silva",
              phone: "(16) 99999-9999",
              languages: ["Português", "Inglês"],
            },
          ],
        },
      },
    }),
    prisma.municipality.create({
      data: {
        name: "Altinópolis",
        description: "Cidade com rica história e belas paisagens naturais",
        coatOfArms: "https://example.com/altinopolis.png",
        attractions: {
          create: [
            {
              name: "Cachoeira do Salto",
              description: "Cachoeira com 30 metros de altura",
              image: "https://example.com/cachoeira.png",
            },
          ],
        },
      },
    }),
    prisma.municipality.create({
      data: {
        name: "Santo Antônio da Alegria",
        description: "Cidade acolhedora com forte tradição agrícola",
        coatOfArms: "https://example.com/santo-antonio.png",
        attractions: {
          create: [
            {
              name: "Fazenda Histórica",
              description: "Fazenda do século XIX com arquitetura preservada",
              image: "https://example.com/fazenda.png",
            },
          ],
        },
      },
    }),
    prisma.municipality.create({
      data: {
        name: "Luís Antônio",
        description: "Cidade com forte tradição na produção de cana-de-açúcar",
        coatOfArms: "https://example.com/luis-antonio.png",
        attractions: {
          create: [
            {
              name: "Usina Histórica",
              description: "Antiga usina de açúcar transformada em museu",
              image: "https://example.com/usina.png",
            },
          ],
        },
      },
    }),
    prisma.municipality.create({
      data: {
        name: "Cajuru",
        description: "Cidade com belas paisagens rurais e tradições culturais",
        coatOfArms: "https://example.com/cajuru.png",
        attractions: {
          create: [
            {
              name: "Igreja Nossa Senhora do Rosário",
              description: "Igreja histórica do centro da cidade",
              image: "https://example.com/igreja.png",
            },
          ],
        },
      },
    }),
    prisma.municipality.create({
      data: {
        name: "Cássia dos Coqueiros",
        description: "Cidade pequena e acolhedora com tradições preservadas",
        coatOfArms: "https://example.com/cassia.png",
        attractions: {
          create: [
            {
              name: "Praça Central",
              description: "Praça com arquitetura histórica",
              image: "https://example.com/praca.png",
            },
          ],
        },
      },
    }),
    prisma.municipality.create({
      data: {
        name: "Santa Rosa de Viterbo",
        description: "Cidade com rico patrimônio histórico e cultural",
        coatOfArms: "https://example.com/santa-rosa.png",
        attractions: {
          create: [
            {
              name: "Museu Histórico",
              description: "Museu com acervo da história local",
              image: "https://example.com/museu.png",
            },
          ],
        },
      },
    }),
  ]);

  // Criar usuários admin
  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@example.com",
      password: "$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu",
      role: "ADMIN",
    },
  });

  console.log("Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
