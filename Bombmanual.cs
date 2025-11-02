using System;
using System.Collections.Generic;

namespace Bombdefusemanual
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.OutputEncoding = System.Text.Encoding.UTF8;

            while (true)
            {
                ShowMainMenu();
                string choice = Console.ReadLine();

                if (choice == "0")
                {
                    Console.Clear();
                    Console.ForegroundColor = ConsoleColor.Red;
                    Console.WriteLine("Kilépés...");
                    Console.ResetColor();
                    break;
                }

                ShowModuleInfo(choice);
            }
        }

        static void ShowMainMenu()
        {
            Console.Clear();
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine("╔════════════════════════════════════════════════════╗");
            Console.WriteLine("║         BOMBA HATÁSTALANÍTÁSI KÉZIKÖNYV            ║");
            Console.WriteLine("║      Keep Talking and Nobody Explodes v2.0         ║");
            Console.WriteLine("╚════════════════════════════════════════════════════╝");
            Console.ResetColor();
            Console.WriteLine();

            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("FIGYELMEZTETÉS");
            Console.ForegroundColor = ConsoleColor.White;
            Console.WriteLine("A bombát hatástalanító játékos NEM láthatja!\n");
            Console.ResetColor();

            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("═══════════════════════════════════════════════════════════");
            Console.WriteLine("                    MODULOK LISTÁJA");
            Console.WriteLine("═══════════════════════════════════════════════════════════\n");
            Console.ResetColor();

            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("1.  VEZETÉKEK");
            Console.WriteLine("2.  GOMB");
            Console.WriteLine("3.  BILLENTYŰZET");
            Console.WriteLine("4.  SIMON SAYS");
            Console.WriteLine("5.  RÁDIÓ FREKVENCIA");
            Console.WriteLine("6.  MORSE KÓD");
            Console.WriteLine("7.  JELSZÓ");
            Console.WriteLine("8.  LABIRINTUS");
            Console.WriteLine("9.  SZÁMSORREND");
            Console.WriteLine("10. SZÍNKÓD");
            Console.WriteLine("11. GOMB FORGATÁS");
            Console.WriteLine("12. KAPCSOLÓK");
            Console.ResetColor();

            Console.WriteLine();
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("0.  KILÉPÉS");
            Console.ResetColor();

            Console.WriteLine();
            Console.Write("Válassz modult (0-12): ");
        }

        static void ShowModuleInfo(string choice)
        {
            Console.Clear();

            switch (choice)
            {
                case "1":
                    ShowWiresModule();
                    break;
                case "2":
                    ShowButtonModule();
                    break;
                case "3":
                    ShowKeypadModule();
                    break;
                case "4":
                    ShowSimonModule();
                    break;
                case "5":
                    ShowFrequencyModule();
                    break;
                case "6":
                    ShowMorseModule();
                    break;
                case "7":
                    ShowPasswordModule();
                    break;
                case "8":
                    ShowMazeModule();
                    break;
                case "9":
                    ShowSequenceModule();
                    break;
                case "10":
                    ShowColorCodeModule();
                    break;
                case "11":
                    ShowKnobModule();
                    break;
                case "12":
                    ShowSwitchesModule();
                    break;
                default:
                    Console.WriteLine("");
                    return;
            }

            Console.WriteLine();
            Console.ForegroundColor = ConsoleColor.Gray;
            Console.WriteLine("Nyomj ENTER-t a folytatáshoz...");
            Console.ResetColor();
            Console.ReadLine();
        }

        static void ShowWiresModule()
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("═══════════════════════════════════════════════════════════");
            Console.WriteLine("              1. VEZETÉKEK - EGYSZERŰSÍTETT!");
            Console.WriteLine("═══════════════════════════════════════════════════════════\n");
            Console.ResetColor();

            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("FONTOS: Olvass SORRENDBEN! Az ELSŐ feltétel ami teljesül!\n");
            Console.ResetColor();

            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("=== 3 VEZETÉK ===");
            Console.ResetColor();
            Console.WriteLine("1. Ha NINCS piros → vágd a 2. vezetéket");
            Console.WriteLine("2. Ha az utolsó vezeték fehér → vágd az utolsó vezetéket");
            Console.WriteLine("3. Ha több mint 1 kék van → vágd az utolsó kék vezetéket");
            Console.WriteLine("4. Különben → vágd az utolsó vezetéket\n");

            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("=== 4 VEZETÉK ===");
            Console.ResetColor();
            Console.WriteLine("1. Ha több mint 1 piros van → vágd az utolsó piros vezetéket");
            Console.WriteLine("2. Ha az utolsó vezeték sárga → vágd az 1. vezetéket");
            Console.WriteLine("3. Ha pontosan 1 kék van → vágd az 1. vezetéket");
            Console.WriteLine("4. Ha több mint 1 sárga van → vágd az utolsó vezetéket");
            Console.WriteLine("5. Különben → vágd a 2. vezetéket\n");

            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("=== 5 VEZETÉK ===");
            Console.ResetColor();
            Console.WriteLine("1. Ha az utolsó vezeték fekete → vágd a 4. vezetéket");
            Console.WriteLine("2. Ha pontosan 1 piros ÉS több mint 1 sárga → vágd az 1. vezetéket");
            Console.WriteLine("3. Ha NINCS fekete vezeték → vágd a 2. vezetéket");
            Console.WriteLine("4. Ha több mint 1 fehér van → vágd a 3. vezetéket");
            Console.WriteLine("5. Különben → vágd az 1. vezetéket\n");

            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("=== 6 VEZETÉK ===");
            Console.ResetColor();
            Console.WriteLine("1. Ha NINCS sárga → vágd a 3. vezetéket");
            Console.WriteLine("2. Ha pontosan 1 sárga ÉS több mint 1 fehér → vágd a 4. vezetéket");
            Console.WriteLine("3. Ha NINCS piros → vágd az utolsó vezetéket");
            Console.WriteLine("4. Ha több mint 1 kék van → vágd a 2. vezetéket");
            Console.WriteLine("5. Különben → vágd a 4. vezetéket");
        }

        static void ShowButtonModule()
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("═══════════════════════════════════════════════════════════");
            Console.WriteLine("                    2. GOMB");
            Console.WriteLine("═══════════════════════════════════════════════════════════\n");
            Console.ResetColor();

            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("NYOMD MEG (gyorsan) ha:");
            Console.ResetColor();
            Console.WriteLine("  • KÉK gomb ÉS 'ABORT' felirat");
            Console.WriteLine("  • PIROS gomb ÉS 'HOLD' felirat");
            Console.WriteLine("  • KÉK gomb és BÁRMILYEN MÁS felirat\n");

            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("TARTSD (500ms+) ha:");
            Console.ResetColor();
            Console.WriteLine("  • FEHÉR gomb (bármilyen felirat)");
            Console.WriteLine("  • SÁRGA gomb (bármilyen felirat)");
            Console.WriteLine("  • PIROS gomb ÉS NEM 'HOLD'\n");

            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("HA TARTOD:");
            Console.ResetColor();
            Console.WriteLine("Megjelenik egy LED szám (1, 4, vagy 5):");
            Console.WriteLine("  • Ha 1 látszik → Engedd el amikor 1 van az időben");
            Console.WriteLine("  • Ha 4 látszik → Engedd el amikor 4 van az időben");
            Console.WriteLine("  • Ha 5 látszik → Engedd el amikor 5 van az időben\n");

            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("Példa: LED: 4 → Idő: 2:04, 2:14, 2:24");
            Console.ResetColor();
        }

        static void ShowKeypadModule()
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("═══════════════════════════════════════════════════════════");
            Console.WriteLine("              3. BILLENTYŰZET - 12 SZIMBÓLUM");
            Console.WriteLine("═══════════════════════════════════════════════════════════\n");
            Console.ResetColor();

            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("HELYES SORREND - MIND A 12 SZIMBÓLUM:\n");
            Console.ResetColor();

            Console.ForegroundColor = ConsoleColor.Cyan;
            string[] symbols = {
                "1.  ☆ ",
                "2.  ¶ ",
                "3.  Ω ",
                "4.  Ϙ ",
                "5.  ☃ ",
                "6.  Ӭ  ",
                "7.  ɶ  ",
                "8.  ψ  ",
                "9.  ¿  ",
                "10. λ  ",
                "11. Ѭ  ",
                "12. Ѽ  "
            };

            foreach (var symbol in symbols)
            {
                Console.WriteLine(symbol);
            }
            Console.ResetColor();

            Console.WriteLine();
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("FONTOS:");
            Console.ResetColor();
            Console.WriteLine("• Mind a 12 szimbólum látszik véletlenszerű elrendezésben");
            Console.WriteLine("• Nyomd meg MIND A 12-T a FENTI sorrendben!");
            Console.WriteLine("• Ez a sorrend MINDIG ugyanaz!");
            Console.WriteLine("• Rossz sorrend → STRIKE és újrakezdés!");
        }

        static void ShowSimonModule()
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("═══════════════════════════════════════════════════════════");
            Console.WriteLine("                  4. SIMON SAYS - 8 KÖR");
            Console.WriteLine("═══════════════════════════════════════════════════════════\n");
            Console.ResetColor();

            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("FONTOS: Nyomd meg a START gombot először!\n");
            Console.ResetColor();

            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("EGYSZERŰSÍTETT SZABÁLYOK:");
            Console.ResetColor();
            Console.WriteLine("Csak ismételd vissza pontosan amit látsz!\n");

            Console.ForegroundColor = ConsoleColor.Red;
            Console.Write("PIROS");
            Console.ResetColor();
            Console.Write(" villog → nyomd ");
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine("PIROS");
            Console.ResetColor();

            Console.ForegroundColor = ConsoleColor.Blue;
            Console.Write("KÉK");
            Console.ResetColor();
            Console.Write(" villog → nyomd ");
            Console.ForegroundColor = ConsoleColor.Blue;
            Console.WriteLine("KÉK");
            Console.ResetColor();

            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.Write("SÁRGA");
            Console.ResetColor();
            Console.Write(" villog → nyomd ");
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("SÁRGA");
            Console.ResetColor();

            Console.ForegroundColor = ConsoleColor.Green;
            Console.Write("ZÖLD");
            Console.ResetColor();
            Console.Write(" villog → nyomd ");
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("ZÖLD");
            Console.ResetColor();

            Console.WriteLine();
            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("PÉLDA:");
            Console.ResetColor();
            Console.WriteLine("Kör 1: PIROS → nyomd PIROS");
            Console.WriteLine("Kör 2: PIROS, KÉK → nyomd PIROS, KÉK");
            Console.WriteLine("Kör 3: PIROS, KÉK, ZÖLD → nyomd PIROS, KÉK, ZÖLD");
            Console.WriteLine("...");
            Console.WriteLine("Kör 8: Mind a 8 színt!");
        }

        static void ShowFrequencyModule()
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("═══════════════════════════════════════════════════════════");
            Console.WriteLine("              5. RÁDIÓ FREKVENCIA");
            Console.WriteLine("═══════════════════════════════════════════════════════════\n");
            Console.ResetColor();

            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("MI A FELADAT?");
            Console.ResetColor();
            Console.WriteLine("Számítsd ki a helyes frekvenciát a  SZÉRIASZÁM alapján!\n");

            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("GOMBOK:");
            Console.ResetColor();
            Console.WriteLine("  ◀◀ = -0.2 MHz (nagy lépés lefelé)");
            Console.WriteLine("  ◀  = -0.1 MHz (kis lépés lefelé)");
            Console.WriteLine("  ▶  = +0.1 MHz (kis lépés felfelé)");
            Console.WriteLine("  ▶▶ = +0.2 MHz (nagy lépés felfelé)\n");

            Console.WriteLine("Tartomány: 3.5 - 5.5 MHz");
            Console.WriteLine("Formátum: 1 tizedesjegy\n");

            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("EGYSZERŰ KÉPLET:");
            Console.ResetColor();
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("Frekvencia = 3.5 + (számjegyek összege × 0.1)");
            Console.ResetColor();

            Console.WriteLine();
            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("PÉLDA SZÁMÍTÁS:");
            Console.ResetColor();
            Console.WriteLine("Szériaszám: AB4C2D");
            Console.WriteLine("Számjegyek: 4 + 2 = 6");
            Console.WriteLine("Képlet: 3.5 + (6 × 0.1) = 3.5 + 0.6 = 4.1 MHz");
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("HELYES FREKVENCIA: 4.1 MHz");
            Console.ResetColor();

            Console.WriteLine();
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("FONTOS:");
            Console.ResetColor();
            Console.WriteLine("• TOLERANCIA: +/- 0.05 MHz elfogadott!");
            Console.WriteLine("• CSAK a számjegyeket számold össze (betűket NEM!)");
        }

        static void ShowMorseModule()
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("═══════════════════════════════════════════════════════════");
            Console.WriteLine("                    6. MORSE KÓD");
            Console.WriteLine("═══════════════════════════════════════════════════════════\n");
            Console.ResetColor();

            Console.WriteLine("Dekódold a Morse kódot BETŰKKÉ!\n");

            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("Lehetséges szavak:");
            Console.ResetColor();
            Console.WriteLine("SOS, HELLO, BOMB, HELP, CODE, WIRE, BOOM, SAFE, TIME, TICK\n");

            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("Morse kód:");
            Console.ResetColor();
            Console.WriteLine("A .-    B -...  C -.-.  D -..");
            Console.WriteLine("E .     F ..-.  G --.   H ....");
            Console.WriteLine("I ..    J .---  K -.-   L .-..");
            Console.WriteLine("M --    N -.    O ---   P .--.");
            Console.WriteLine("Q --.-  R .-.   S ...   T -");
            Console.WriteLine("U ..-   V ...-  W .--   X -..-");
            Console.WriteLine("Y -.--  Z --..\n");

            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("PÉLDA:");
            Console.ResetColor();
            Console.WriteLine("Kijelző: ... --- ...");
            Console.WriteLine("       → S   O   S");
            Console.WriteLine("Írd be: SOS");
        }

        static void ShowPasswordModule()
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("═══════════════════════════════════════════════════════════");
            Console.WriteLine("              7. JELSZÓ - CSAK 12 SZÓ!");
            Console.WriteLine("═══════════════════════════════════════════════════════════\n");
            Console.ResetColor();

            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("CSAK 12 EGYSZERŰ SZÓ:\n");
            Console.ResetColor();

            Console.ForegroundColor = ConsoleColor.Cyan;
            string[] passwords = { "WATER", "HOUSE", "LIGHT", "WORLD",
                                  "FIRST", "GREAT", "SOUND", "SMALL",
                                  "MAGIC", "BLAST", "CODES", "THING" };

            for (int i = 0; i < passwords.Length; i++)
            {
                Console.Write(passwords[i].PadRight(8));
                if ((i + 1) % 4 == 0) Console.WriteLine();
            }
            Console.ResetColor();

            Console.WriteLine();
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("🎮 JÁTÉKMENET:");
            Console.ResetColor();
            Console.WriteLine("• Minden pozíción 4 betű közül választhatsz");
            Console.WriteLine("• Kattints a betűkre → változnak");
            Console.WriteLine("• Próbáld ki a felsorolt szavakat");
            Console.WriteLine("• ELLENŐRIZ gomb → beküldés");
        }

        static void ShowMazeModule()
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("═══════════════════════════════════════════════════════════");
            Console.WriteLine("          8. LABIRINTUS - 8x8 NEHÉZ!");
            Console.WriteLine("═══════════════════════════════════════════════════════════\n");
            Console.ResetColor();

            Console.WriteLine("• LÁTHATATLAN FALAK vannak!");
            Console.WriteLine("• Ha falba ütközöl → STRIKE!\n");

            Console.ForegroundColor = ConsoleColor.White;
            Console.WriteLine("┌───┬───┬───┬───┬───┬───┬───┬───┐");
            Console.ResetColor();

            string[] maze = {
                "│ S │ 🡲 │ 🡲 │ 🡲 │ 🡣 │ ■ │ ■ │ ■ │",
                "│ ■ │ ■ │ 🡣 │ ■ │ 🡣 │ ■ │ ■ │ ■ │",
                "│ 🡰 │ 🡰 │ 🡣 │ 🡲 │ 🡲 │ 🡲 │ 🡲 │ ■ │",
                "│ 🡣 │ 🡲 │ ■ │ ■ │ ■ │ ■ │ 🡣 │ ■ │",
                "│ ■ │ 🡣 │ ■ │ ■ │ ■ │ ■ │ ■ │ ■ │",
                "│ ■ │ 🡣 │ 🡩 │ 🡲 │ 🡲 │ 🡲 │ 🡲 │ ■ │",
                "│ ■ │ 🡣 │ 🡩 │ ■ │ ■ │ ■ │ 🡣 │ ■ │",
                "│ ■ │ 🡣 │ 🡲 │ 🡲 │ 🡲 │ ■ │ 🡣 │ C │"
            };
            string separator = "├───┼───┼───┼───┼───┼───┼───┼───┤";

            for (int i = 0; i < maze.Length; i++)
            {
                foreach (char c in maze[i])
                {
                    if (c == 'S')
                        Console.ForegroundColor = ConsoleColor.Red;
                    else if (c == 'C')
                        Console.ForegroundColor = ConsoleColor.Green;
                    else if (c == '●')
                        Console.ForegroundColor = ConsoleColor.Yellow;
                    else if (c == '■')
                        Console.ForegroundColor = ConsoleColor.DarkGray;
                    else
                        Console.ForegroundColor = ConsoleColor.White;

                    Console.Write(c);
                }
                Console.WriteLine();

                if (i < maze.Length - 1)
                {
                    Console.ForegroundColor = ConsoleColor.White;
                    Console.WriteLine(separator);
                }
            }

            Console.ForegroundColor = ConsoleColor.White;
            Console.WriteLine("└───┴───┴───┴───┴───┴───┴───┴───┘");
            Console.ResetColor();
        }

        static void ShowSequenceModule()
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("═══════════════════════════════════════════════════════════");
            Console.WriteLine("                  9. SZÁMSORREND");
            Console.WriteLine("═══════════════════════════════════════════════════════════\n");
            Console.ResetColor();

            Console.WriteLine("Feladat: Nyomd meg a gombokat 1 → 2 → 3 → 4 sorrendben!\n");

            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("PÉLDA:");
            Console.ResetColor();
            Console.WriteLine("Ha kijelző: 3 1 4 2");
            Console.WriteLine("         → Nyomd: [3] [1] [4] [2]\n");

            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("Figyelem: Ha hibázol, újrakezdődik!");
            Console.ResetColor();
        }

        static void ShowColorCodeModule()
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("═══════════════════════════════════════════════════════════");
            Console.WriteLine("                    10. SZÍNKÓD");
            Console.WriteLine("═══════════════════════════════════════════════════════════\n");
            Console.ResetColor();

            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("Színkódok:");
            Console.ResetColor();
            Console.WriteLine("R = PIROS (Red)");
            Console.WriteLine("G = ZÖLD (Green)");
            Console.WriteLine("B = KÉK (Blue)");
            Console.WriteLine("Y = SÁRGA (Yellow)");
            Console.WriteLine("M = MAGENTA (A nehézség kedvéért)");
            Console.WriteLine("C = CIÁN (Cyan)\n");

            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("PÉLDA:");
            Console.ResetColor();
            Console.WriteLine("[PIROS][ZÖLD][KÉK] → RGB");
            Console.WriteLine("[SÁRGA][MAGENTA][CIÁN] → YMC\n");

            Console.WriteLine("Írd be NAGYBETŰVEL, szóköz nélkül!");
        }

        static void ShowKnobModule()
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("═══════════════════════════════════════════════════════════");
            Console.WriteLine("                 11. GOMB FORGATÁS");
            Console.WriteLine("═══════════════════════════════════════════════════════════\n");
            Console.ResetColor();

            Console.WriteLine("6 LED világít mintát mutat.");
            Console.WriteLine("A minta meghatározza melyik irányba kell forgatni.\n");

            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("LED MINTÁK:");
            Console.ResetColor();
            Console.WriteLine("⚫⚪⚫⚪⚫⚪ → DOWN");
            Console.WriteLine("⚪⚫⚪⚫⚪⚫ → UP");
            Console.WriteLine("⚫⚫⚪⚪⚫⚪ → RIGHT");
            Console.WriteLine("⚪⚪⚫⚫⚪⚫ → LEFT");
            Console.WriteLine("⚫⚪⚪⚫⚫⚪ → DOWN (alt)");
            Console.WriteLine("⚪⚫⚫⚪⚪⚫ → UP (alt)");
        }

        static void ShowSwitchesModule()
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("═══════════════════════════════════════════════════════════");
            Console.WriteLine("                   12. KAPCSOLÓK");
            Console.WriteLine("═══════════════════════════════════════════════════════════\n");
            Console.ResetColor();

      

            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("A konfigurációt látod a modulon.");
            Console.ResetColor();
            Console.WriteLine("4 kapcsoló\n");
            Console.WriteLine("Ez egy próbálgatás alapú játék!\nNINCS előre meghatározott szabály!");
            Console.WriteLine("PL:");
            Console.WriteLine("    → 1. kapcsoló: BE");
            Console.WriteLine("    → 2. kapcsoló: KI");
            Console.WriteLine("    → 3. kapcsoló: BE");
            Console.WriteLine("    → 4. kapcsoló: KI");
        }
    }
}
