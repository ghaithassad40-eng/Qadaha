export interface AnnouncerContext {
  team?: string      // current team playing
  others?: string[]  // all other team names
  leader?: string    // team in first place
  lagging?: string   // team in last place
  score?: number     // current team's score
  gap?: number       // points gap between 1st and 2nd
  winScore?: number  // target score
}

// {team}     → current team name
// {other}    → random opponent name
// {others}   → all opponents joined
// {leader}   → first-place team
// {lagging}  → last-place team
// {score}    → current team score
// {winScore} → target score

const LINES: Record<string, string[]> = {
  welcome: [
    'أهلاً وسهلاً في قدها! اللعبة اللي ما تعرف وين تودّيك! 😂',
    'مساء الضحكات يا أبطال! جهّزوا أنفسكم! 🎙️',
    'قدها موجودة والضحك مضمون – الكل ضد الكل! 🎉',
  ],
  turn: [
    'دور {team}! يلا يا بطوليين، اثبتوا جدارتكم! 💪',
    'يا {team}! {other} يراقبكم بعيون كبيرة! لا تخذلونا! 😂',
    '{team}، اللحظة جاءت! {others} يترقبون! 🎯',
    'جهّز نفسك يا {team}! {other} ودّه يشوفك تفشل! 😈',
    'الدور على {team}! والله {other} خايفين عليكم! 🤣',
  ],
  correct: [
    'وااااو! {team} جاوب صح! والله ذكاء مش طبيعي! 🎉',
    'برافو يا {team}! يا {other}، شوفوا كيف يسوى! 😂',
    'ما شاء الله {team}! أكيد راجعت على جوجل قبل اللعبة! 😜',
    'نقطة لـ{team}! يا {other}، هل ما عندكم ما تقولون؟ 😆',
    '{team} يحسم النقطة! و{other} يعض أصابعه من الغيرة! 💅',
    'الله الله يا {team}! الباقين «{others}» يبكون في الزاوية! 😂',
    '{team} يضرب ويسجّل! يا {other} – هذا درس مجاني! 🎓',
  ],
  wrong: [
    'غلط يا {team}! هذا السؤال كان من الصف الأول! 😂',
    'يا {team}... {other} يضحك عليكم الآن! 😅',
    'أوف يا {team}! الجواب كان واضح مثل الشمس! 🌞',
    'يا {team}، المهم المشاركة! (مش المهم أبداً) 😆',
    '{team} تعثّروا! {other} يصفقون من الشماتة! 👏',
    'حبيبي يا {team}، الإجابة كانت... خلني أسكت 😶',
    'يا {team}! كيف؟! {other} حتى هم كانوا يعرفون الجواب! 😱',
  ],
  skip: [
    'تخطي؟! يا {team} أنتم ليش هنا؟ 😂',
    '{team} يهربون من التحدي! والله {other} ما توقّعوا هالجبن! 🧀',
    'يا {team}، «تخطي» مش استراتيجية – هي هروب! 😏',
    '{other} يضحكون عليكم يا {team}! تشجّعوا! 😤',
  ],
  close: [
    'الفرق نقطة بين {leader} والباقين! يا حرارة الموقف! 🔥',
    '{leader} في المقدمة بصعوبة! كل شيء ممكن! 😮',
    'تعادل تقريباً! {others} كلهم في اللعبة! 🫀',
    'لا أحد أمان! {leader} يتعرق الآن! 😂',
  ],
  leading: [
    '{leader} يتصدر بفارق {gap} نقاط! بس اللعبة ما خلصت! 🏆',
    'وااو {leader} قدام! {others} نايمين؟ صحّوا! 😂',
    '{leader} يسرح ويمرح! لكن انتبه... الانتقام قادم! 😈',
  ],
  comeback: [
    'انتبهوا! {team} يقترب من المتصدر! الجميع في خطر! 🔥',
    '{team} يعود بقوة! {leader} ابدأ بالقلق! 😮',
    'لا تستهينوا بـ{team}! الكبة الآن في ملعبهم! ⚡',
  ],
  pressure: [
    '{team} يحتاج نقطة واحدة فقط للفوز! {others} تنفسوا! 😱',
    'آخر نقطة وينتهي كل شيء! {team} على بعد خطوة! 💀',
    'المتفرجون قلقون! {team} بنقطة من الحسم! 🫣',
  ],
  question: [
    'سؤال وجواب! يا {team} الذكاء مطلوب الآن! 🧠',
    '{team}، هذا السؤال سهل على أمثالكم... أو هكذا أتمنى! 😅',
    'يا {others}، جهّزوا أنفسكم للضحك إذا أخطأ {team}! 😂',
  ],
  singing: [
    'غناء! يا {team} وريهم الصوت الذهبي اللي فيكم! 🎤',
    'لو {team} غنّى زين نقطة! لو غنّى وحش... {other} يضحك طول الليل! 😂',
    'المسرح لـ{team}! {others} ينتظرون بفارغ الصبر! 🎵',
  ],
  acting: [
    'هوليوود العرب! {team} يمثّل الآن! 🎬',
    'يا {team}، المسرح مفتوح و{other} الجمهور! اجعلوها لا تُنسى! 🌟',
    '{others}، شوفوا كيف يمثّل {team}! وحكموا بأنفسكم! 🎭',
  ],
  charades: [
    'إشارات بدون كلام! يا {team} حرّك يديك وخلّي {other} يخمّن! 🤫',
    '{team} يمثّل، و{others} يحاولون يفهمون! 🙊',
    'لا صوت، لا كلام! {team} يتكلم بالجسم! 😂',
  ],
  speed: [
    'تحدي السرعة! يا {team} الثواني تعدّ! {other} يراقب! ⚡',
    '{team}، السرعة اللي بداخلك الآن! {others} يشككون فيك! ⏱️',
  ],
  dare: [
    'تحدي جرأة! هل {team} جاهز؟ {other} يراهن إنك تفشل! 😈',
    '{team}، أثبت لـ{others} إنك مش جبان! 💪',
  ],
  gameover: [
    'أووووه! اللعبة خلصت! شكراً لـ{others} على الخسارة الكريمة! 🎉',
    'كانت لعبة خرافية! كلكم أبطال – حتى اللي خسر! 🏆',
    'يا ناس شكراً على هالليلة! قدها مش بس لعبة – هي ذكريات! 💛',
    'الفائز يستاهل! واللي خسر – التدريب يفيد! 😂',
  ],
  spin: [
    'دور دور يا حظ! يا {team} ترا القدر ما يرحم! 😅',
    'ياربي اللي طالع لـ{team}... أنا خايف بدلهم! 🙈',
    'العجلة تدور و{team} يترقب! {other} يتمنالهم السوء! 😂',
  ],
}

function fill(template: string, ctx: AnnouncerContext): string {
  const otherList = ctx.others ?? []
  const randomOther = otherList.length
    ? otherList[Math.floor(Math.random() * otherList.length)]
    : 'الفريق الثاني'
  const allOthers = otherList.join(' و') || 'الباقين'

  return template
    .replace(/{team}/g,     ctx.team     ?? 'الفريق')
    .replace(/{other}/g,    randomOther)
    .replace(/{others}/g,   allOthers)
    .replace(/{leader}/g,   ctx.leader   ?? 'المتصدر')
    .replace(/{lagging}/g,  ctx.lagging  ?? 'الأخير')
    .replace(/{score}/g,    String(ctx.score    ?? 0))
    .replace(/{winScore}/g, String(ctx.winScore ?? 10))
    .replace(/{gap}/g,      String(ctx.gap      ?? 0))
}

export function getAnnouncerLine(type: string, ctx: AnnouncerContext = {}): string {
  const pool = LINES[type] ?? LINES.welcome
  const template = pool[Math.floor(Math.random() * pool.length)]
  return fill(template, ctx)
}
