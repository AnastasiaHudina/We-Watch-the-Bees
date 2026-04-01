import { useState } from 'react';
import { BookOpen, ChevronRight, ArrowLeft, Send, ThumbsUp, Reply } from 'lucide-react';

interface Comment {
  id: number;
  userId: string;
  author: string;
  text: string;
  date: string;
  likes: number;
  replyTo?: number;
}

interface Article {
  id: number;
  title: string;
  category: string;
  content: string;
  author: string;
  date: string;
}

const categories = [
  {
    name: 'Начинающему пчеловоду',
    articles: [
      {
        id: 1,
        title: 'Основы пчеловодства: с чего начать',
        category: 'Начинающему пчеловоду',
        content: 'Пчеловодство - увлекательное и полезное занятие. Для начала вам потребуется изучить основы биологии пчёл, приобрести необходимое оборудование и выбрать подходящее место для пасеки.\n\nРекомендуется начинать с 2-3 семей, чтобы получить опыт без излишних затрат. Важно выбрать правильный тип улья - Дадан или Рута, изучить календарь работ пчеловода и понять основные процессы в жизни пчелиной семьи.\n\nПервый год будет годом обучения. Наблюдайте за пчёлами, ведите дневник пасечника, общайтесь с опытными коллегами. Не торопитесь расширять пасеку - важно сначала получить стабильные результаты с небольшим количеством семей.',
        author: 'Иван Медовый',
        date: '1 декабря 2024'
      },
      {
        id: 2,
        title: 'Выбор первого улья',
        category: 'Начинающему пчеловоду',
        content: 'При выборе улья важно учитывать климатические условия вашего региона, доступность комплектующих и ваши физические возможности.\n\nУлей Дадана подходит для регионов с холодными зимами, он вместительный и позволяет пчёлам хорошо перезимовать. Стандартная рамка Дадана имеет размер 435x300 мм, что обеспечивает достаточно места для расплода и запасов.\n\nУлей Рута более компактен и удобен для интенсивного пчеловодства. Рамки меньше (435x230 мм), что облегчает работу, но требует большего количества корпусов. Важно приобретать качественные ульи из сухого дерева толщиной не менее 35 мм.',
        author: 'Сергей Рамочников',
        date: '28 ноября 2024'
      }
    ]
  },
  {
    name: 'Сезонные работы',
    articles: [
      {
        id: 3,
        title: 'Подготовка пчёл к зимовке',
        category: 'Сезонные работы',
        content: 'Зимовка - критический период в жизни пчелиной семьи. Подготовка начинается с конца лета. Необходимо провести осеннюю ревизию, оценить силу семьи, запасы корма (не менее 20-25 кг мёда на семью).\n\nВажно провести профилактическую обработку от варроатоза, утеплить ульи, обеспечить вентиляцию. В регионах с суровыми зимами рекомендуется зимовка в омшанике.\n\nПри подготовке к зимовке обратите внимание на качество корма - закристаллизованный мёд или падевый мёд могут вызвать понос у пчёл. При необходимости проведите подкормку сахарным сиропом в пропорции 3:2.',
        author: 'Петр Бортников',
        date: '25 ноября 2024'
      },
      {
        id: 4,
        title: 'Весенняя ревизия пасеки',
        category: 'Сезонные работы',
        content: 'Первый весенний осмотр проводится после устойчивого потепления, когда температура достигнет 12-14°C. Необходимо оценить силу семьи после зимовки, проверить наличие матки и расплода, оценить запасы корма.\n\nСлабые семьи объединяют, семьи без матки присоединяют к другим или подсаживают запасную матку. Важно провести санитарную обработку ульев, заменить загрязнённые рамки.\n\nВ это время пчёлам необходима белковая подкормка - пыльца или её заменители. Также проверьте состояние гнёзд и при необходимости сократите их для лучшего обогрева.',
        author: 'Иван Медовый',
        date: '20 ноября 2024'
      }
    ]
  },
  {
    name: 'Здоровье пчёл',
    articles: [
      {
        id: 5,
        title: 'Борьба с варроатозом',
        category: 'Здоровье пчёл',
        content: 'Варроатоз - самое опасное заболевание пчёл, вызываемое клещом Varroa destructor. Для борьбы используют химические препараты (бипин, апистан), биологические методы (хищные клещи), зоотехнические приёмы (удаление трутневого расплода).\n\nОбработки проводят весной после выставки пчёл и осенью после откачки мёда. Важно чередовать препараты для предотвращения резистентности клеща.\n\nЭффективным методом является использование строительных рамок - клещи предпочитают трутневый расплод, и его своевременное удаление значительно снижает популяцию паразита.',
        author: 'Елена Пасечникова',
        date: '15 ноября 2024'
      }
    ]
  }
];

export function KnowledgeBaseSection() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Record<number, Comment[]>>({
    1: [
      {
        id: 1,
        userId: 'USER001',
        author: 'Михаил Ульянов',
        text: 'Отличная статья! Очень полезная информация для начинающих.',
        date: '2 часа назад',
        likes: 5
      },
      {
        id: 2,
        userId: 'USER002',
        author: 'Ольга Пчеловодова',
        text: 'Спасибо за подробное описание! У меня вопрос: какую породу пчёл вы бы рекомендовали для Подмосковья?',
        date: '5 часов назад',
        likes: 3
      }
    ]
  });

  const [newComment, setNewComment] = useState('');
  const [replyToComment, setReplyToComment] = useState<number | null>(null);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && selectedArticle) {
      const comment: Comment = {
        id: Date.now(),
        userId: 'USER999',
        author: 'Вы',
        text: newComment,
        date: 'Только что',
        likes: 0,
        replyTo: replyToComment || undefined
      };
      
      setComments({
        ...comments,
        [selectedArticle.id]: [
          ...(comments[selectedArticle.id] || []),
          comment
        ]
      });
      
      setNewComment('');
      setReplyToComment(null);
    }
  };

  const handleLike = (commentId: number) => {
    if (!selectedArticle) return;
    
    setComments({
      ...comments,
      [selectedArticle.id]: (comments[selectedArticle.id] || []).map(comment =>
        comment.id === commentId
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      )
    });
  };

  const handleReply = (commentId: number, userId: string) => {
    setReplyToComment(commentId);
    setNewComment(`@${userId} `);
  };

  if (selectedArticle) {
    const articleComments = comments[selectedArticle.id] || [];
    
    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => {
            setSelectedArticle(null);
            setReplyToComment(null);
            setNewComment('');
          }}
          className="flex items-center gap-2 text-amber-600 hover:text-amber-700 mb-6 p-2 hover:bg-amber-50 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Назад к содержанию
        </button>

        {/* Статья */}
        <article className="bg-white rounded-xl shadow-md p-8 border border-amber-100 mb-6">
          <div className="mb-6">
            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
              {selectedArticle.category}
            </span>
          </div>

          <h1 className="text-gray-800 mb-4">{selectedArticle.title}</h1>

          <div className="flex items-center gap-4 mb-6 text-gray-600 text-sm">
            <span>Автор: {selectedArticle.author}</span>
            <span>•</span>
            <span>{selectedArticle.date}</span>
          </div>

          <div className="prose max-w-none mb-8">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {selectedArticle.content}
            </p>
          </div>
        </article>

        {/* Вопросы и Комментарии */}
        <div className="bg-white rounded-xl shadow-md p-8 border border-amber-100">
          <h3 className="text-gray-800 mb-6">Вопросы и Комментарии</h3>

          {/* Форма добавления комментария */}
          <form onSubmit={handleSubmitComment} className="mb-8">
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              {replyToComment && (
                <div className="mb-2 flex items-center gap-2 text-sm text-amber-700">
                  <Reply className="w-4 h-4" />
                  Ответ на комментарий
                  <button
                    type="button"
                    onClick={() => {
                      setReplyToComment(null);
                      setNewComment('');
                    }}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    Отмена
                  </button>
                </div>
              )}
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Написать комментарий..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[100px] resize-none"
              />
              <div className="flex justify-end mt-3">
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="flex items-center gap-2 px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  Отправить
                </button>
              </div>
            </div>
          </form>

          {/* Список комментариев */}
          <div className="space-y-4">
            {articleComments.length > 0 ? (
              <>
                <h4 className="text-gray-700 mb-4">
                  Комментарии ({articleComments.length})
                </h4>

                {articleComments.map((comment) => {
                  const repliedComment = comment.replyTo 
                    ? articleComments.find(c => c.id === comment.replyTo)
                    : null;

                  return (
                    <div
                      key={comment.id}
                      className="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:border-amber-200 transition-colors"
                    >
                      {repliedComment && (
                        <div className="mb-3 p-3 bg-white rounded border-l-4 border-amber-500">
                          <div className="text-sm text-gray-600 mb-1">
                            В ответ на @{repliedComment.userId}:
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-2">
                            {repliedComment.text}
                          </div>
                        </div>
                      )}

                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-amber-700">
                              {comment.author.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-800">{comment.author}</span>
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs">
                                {comment.userId}
                              </span>
                            </div>
                            <div className="text-gray-500 text-sm">{comment.date}</div>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-3">{comment.text}</p>

                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleLike(comment.id)}
                          className="flex items-center gap-2 text-gray-500 hover:text-amber-600 transition-colors text-sm"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span>{comment.likes}</span>
                        </button>
                        <button
                          onClick={() => handleReply(comment.id, comment.userId)}
                          className="flex items-center gap-2 text-gray-500 hover:text-amber-600 transition-colors text-sm"
                        >
                          <Reply className="w-4 h-4" />
                          Ответить
                        </button>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Пока нет комментариев. Будьте первым!
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-gray-800 mb-2 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-white-600" />
          База Знаний
        </h2>
        <p className="text-white-600">Онлайн-библиотека статей по пчеловодству</p>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-amber-100 overflow-hidden">
        {/* Содержание */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-6">
          <h3 className="text-white mb-2">Содержание</h3>
          <p className="text-amber-100 text-sm">Выберите раздел и статью для чтения</p>
        </div>

        <div className="divide-y divide-gray-100">
          {categories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="p-6">
              <h3 className="text-gray-800 mb-4 flex items-center gap-2">
                <ChevronRight className="w-5 h-5 text-amber-600" />
                {category.name}
              </h3>

              <div className="space-y-2 ml-7">
                {category.articles.map((article) => (
                  <button
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    className="w-full text-left p-4 hover:bg-amber-50 rounded-lg transition-colors border border-transparent hover:border-amber-200"
                  >
                    <div className="text-gray-700 hover:text-amber-700 transition-colors mb-1">
                      {article.title}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {article.author} • {article.date}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
