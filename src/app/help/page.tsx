"use client";
import { useState } from "react";
import { BookOpen, ShieldCheck, ShoppingCart, ChevronDown, HelpCircle, Phone, FileText, FileJson } from "lucide-react";

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Як змінити статус телефону на 'Проданий'?",
      a: "Перейдіть до 'Каталогу', знайдіть потрібний телефон, натисніть на його картку та оберіть відповідний статус у випадаючому списку. Після цього натисніть 'Зберегти'."
    },
    {
      q: "Хто може додавати нові товари в систему?",
      a: "Додавати, редагувати та видаляти товари може лише користувач з роллю 'Адміністратор'. Продавці-консультанти мають права лише на перегляд та зміну статусу на 'Проданий'."
    },
    {
      q: "Як зробити резервну копію бази даних?",
      a: "Ця функція доступна Адміністратору на сторінці 'Особистий кабінет'. Натисніть кнопку 'Вивантажити БД' (Експорт), щоб завантажити файл з усіма даними."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f0f10] text-zinc-300 pb-20">
      <div className="w-full bg-[#19191c] border-b border-white/5 pt-16 pb-12 px-5">
        <div className="max-w-[800px] mx-auto text-center animate-fadeUp">
          <div className="w-16 h-16 bg-[#B03D3D]/10 text-[#B03D3D] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BookOpen size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 font-display">
            Довідкова система NiwaPhone
          </h1>
          <p className="text-zinc-400 text-lg">
            Інструкції, глосарій та відповіді на часті запитання для комфортної роботи з платформою.
          </p>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-5 mt-12 flex flex-col gap-12">
        
        <section className="animate-fadeUp" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <ShieldCheck className="text-[#B03D3D]" /> Функціонал за ролями
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.04] transition-colors">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#B03D3D]" /> Адміністратор
              </h3>
              <ul className="list-disc list-inside text-sm text-zinc-400 space-y-2">
                <li>Повний контроль над каталогом товарів.</li>
                <li>Додавання, редагування та видалення телефонів.</li>
                <li>Доступ до Дашборду (аналітика продажів).</li>
                <li>Керування списком постачальників.</li>
                <li>Експорт та імпорт бази даних.</li>
              </ul>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.04] transition-colors">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <ShoppingCart size={18} className="text-amber-400" /> Продавець-консультант
              </h3>
              <ul className="list-disc list-inside text-sm text-zinc-400 space-y-2">
                <li>Швидкий пошук телефонів за моделлю або IMEI.</li>
                <li>Фільтрація товарів за наявністю.</li>
                <li>Перегляд детальних характеристик.</li>
                <li>Оформлення продажу (зміна статусу).</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="animate-fadeUp" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <BookOpen className="text-[#B03D3D]" /> Глосарій термінів
          </h2>
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-4">
            <div>
              <strong className="text-white">Каталог</strong> - головна сторінка застосунку, де відображається весь асортимент мобільних телефонів у вигляді карток.
            </div>
            <div>
              <strong className="text-white">Дашборд</strong> - панель аналітики для адміністратора, що містить графіки продажів та ключові метрики магазину.
            </div>
            <div>
              <strong className="text-white">Постачальники</strong> - розділ для ведення обліку партнерів, що постачають товар (доступний лише адміністратору).
            </div>
            <div>
              <strong className="text-white">IMEI</strong> - унікальний серійний номер мобільного телефону, за яким можна швидко знайти конкретний екземпляр на складі.
            </div>
          </div>
        </section>

        <section className="animate-fadeUp" style={{ animationDelay: "0.3s" }}>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <HelpCircle className="text-[#B03D3D]" /> Часті запитання (F.A.Q.)
          </h2>
          <div className="flex flex-col gap-3">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden transition-colors hover:bg-white/[0.04]"
              >
                <button 
                  className="w-full text-left p-5 flex items-center justify-between text-white font-medium focus:outline-none"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  {faq.q}
                  <ChevronDown size={20} className={`text-zinc-500 transition-transform duration-300 ${openFaq === idx ? "rotate-180" : ""}`} />
                </button>
                <div 
                  className={`px-5 text-sm text-zinc-400 transition-all duration-300 ease-in-out overflow-hidden ${openFaq === idx ? "max-h-[200px] pb-5 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </section>


        <div className="bg-[#B03D3D]/10 border border-[#B03D3D]/20 rounded-2xl p-6 text-center animate-fadeUp" style={{ animationDelay: "0.4s" }}>
          <Phone className="text-[#B03D3D] mx-auto mb-3" size={24} />
          <h3 className="text-white font-bold mb-2">Залишилися питання?</h3>
          <p className="text-zinc-400 text-sm">Зверніться до головного адміністратора системи за номером.</p>
          <p className="text-zinc-400 text-sm mt-2">(🇺🇦)+380 ** *** ** **</p>
        </div>

        <section className="mt-8 pt-8 border-t border-white/5 animate-fadeUp" style={{ animationDelay: "0.5s" }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-zinc-900/40 p-6 rounded-2xl border border-white/5">
            <div>
              <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#B03D3D]" />
                Технічна документація
              </h3>
              <p className="text-sm text-zinc-500 max-w-md">
                Завантажити довідку у форматі документа Word або переглянути структуру JSON.
              </p>
            </div>
            
            <div className="flex flex-row items-center gap-2">
              <button 
                onClick={() => {
                  const docContent = `
                    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
                    <head>
                      <meta charset="utf-8">
                      <title>Довідкова система NiwaPhone</title>
                      <style>
                        body { font-family: 'Arial', sans-serif; color: #333; line-height: 1.5; }
                        h1 { color: #B03D3D; text-align: center; border-bottom: 2px solid #B03D3D; padding-bottom: 10px; }
                        h2 { color: #2c3e50; margin-top: 20px; }
                        .subtitle { text-align: center; color: #7f8c8d; font-size: 11pt; margin-bottom: 30px; }
                        .faq-item { margin-bottom: 20px; padding: 15px; border-left: 4px solid #B03D3D; background-color: #f9f9f9; }
                        .question { font-weight: bold; font-size: 14pt; margin-bottom: 5px; color: #000; }
                        .answer { font-size: 12pt; color: #444; }
                        .footer { text-align: center; margin-top: 40px; font-size: 10pt; color: #999; border-top: 1px solid #ccc; padding-top: 10px; }
                      </style>
                    </head>
                    <body>
                      <h1>Довідкова система NiwaPhone</h1>
                      <p class="subtitle">Офіційна документація. Версія 6.0</p>
                      
                      <h2>Часті запитання (F.A.Q.)</h2>
                      ${faqs.map(f => `
                        <div class="faq-item">
                          <p class="question">Питання: ${f.q}</p>
                          <p class="answer"><strong>Відповідь:</strong> ${f.a}</p>
                        </div>
                      `).join('')}

                      <p class="footer">© 2026 NiwaPhone System.</p>
                    </body>
                    </html>
                  `;
                  
                  const blob = new Blob(['\ufeff', docContent], { type: 'application/msword' });
                  const url = URL.createObjectURL(blob);
                  const downloadAnchorNode = document.createElement('a');
                  downloadAnchorNode.setAttribute("href", url);
                  downloadAnchorNode.setAttribute("download", "NiwaPhone_Help.doc");
                  document.body.appendChild(downloadAnchorNode);
                  downloadAnchorNode.click();
                  document.body.removeChild(downloadAnchorNode);
                  URL.revokeObjectURL(url);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-transparent hover:bg-white/[0.06] text-zinc-400 hover:text-white transition-colors text-sm font-medium whitespace-nowrap"
              >
                <FileText size={16} />
                Формат DOC
              </button>

              <button 
                onClick={() => {
                  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
                    project: "NiwaPhone",
                    version: "6.0",
                    description: "Довідкова система",
                    help_topics: faqs
                  }, null, 2));
                  
                  const downloadAnchorNode = document.createElement('a');
                  downloadAnchorNode.setAttribute("href", dataStr);
                  downloadAnchorNode.setAttribute("download", "niwaphone_help.json");
                  document.body.appendChild(downloadAnchorNode);
                  downloadAnchorNode.click();
                  downloadAnchorNode.remove();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#B03D3D] hover:bg-[#9a3434] text-white transition-all shadow-md shadow-[#B03D3D]/20 text-sm font-medium whitespace-nowrap"
              >
                <FileJson size={16} />
                Формат JSON
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}