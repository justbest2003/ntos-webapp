"use client";
/* eslint-disable @next/next/no-img-element -- exact source assets are stored locally for visual fidelity */

import { Children, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";

const A = "/sites/pea/images";

const heroSlides = [
  { desktop: "hero-ntos.webp", mobile: "", alt: "NTOS" },
  { desktop: "hero-ntos.webp", mobile: "", alt: "NTOS" },
  { desktop: "hero-ntos.webp", mobile: "", alt: "NTOS" },
  { desktop: "hero-ntos.webp", mobile: "", alt: "NTOS" },
];

type IconName = "search" | "person" | "globe" | "menu" | "arrow" | "phone" | "calendar";

function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" /></>,
    person: <><circle cx="12" cy="7" r="2.7" /><path d="M7.5 21 9 11.5h6L16.5 21M5 6h14" /></>,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.6 2.7 3.8 5.7 3.8 9S14.6 18.3 12 21c-2.6-2.7-3.8-5.7-3.8-9S9.4 5.7 12 3Z" /></>,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    phone: <path d="M7 3H4a2 2 0 0 0-2 2c0 9.4 7.6 17 17 17a2 2 0 0 0 2-2v-3l-5-1-1.2 3c-4.2-1.4-7.4-4.6-8.8-8.8L9 8Z" />,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4m8-4v4M3 10h18" /></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

const missions = [
  "ดำเนินธุรกิจที่สนับสนุนการเติบโตขององค์กรด้าน ICT และให้บริการธุรกิจที่เกี่ยวเนื่อง",
  "พัฒนาระบบงานและการบริหารจัดการองค์กรตามเกณฑ์ TQA",
  "สร้างนวัตกรรมและปรับปรุงคุณภาพอย่างต่อเนื่อง เพื่อความเป็นเลิศในธุรกิจบริการ",
];

const ntosValues = [
  { type: "บริษัท NT-OS", title: "ใส่ใจลูกค้า", detail: "เราเชื่อว่าการใส่ใจลูกค้านั้นถือเป็นภารกิจสูงสุด", tone: "blue" },
  { type: "บริษัท NT-OS", title: "รับผิดชอบทุกการส่งมอบ", detail: "เราปฏิญญาว่าจะรับผิดชอบงานที่ส่งมอบให้มีคุณภาพและทันเวลา", tone: "orange" },
  { type: "คนของ NT-OS", title: "เราทำได้เสมอ", detail: "คนของ NT-OS มีทัศนคติว่า ‘เราทำได้เสมอ’", tone: "blue" },
  { type: "คนของ NT-OS", title: "มุ่งมั่นสู่ความเป็นเลิศ", detail: "คนของ NT-OS มุ่งมั่นสู่ความเป็นเลิศเสมอ", tone: "orange" },
];

const news = [
  { image: "news-fake.webp", title: "❌ เช็กแล้ว แชร์เลย", date: "20 ตุลาคม 2569" },
  { image: "news-scam-call.webp", title: "PEA เตือนภัยมิจฉาชีพแอบอ้างเป็นพนักงาน โทรเรียกเก็บค่าไฟฟ้าย้อนหลัง", date: "20 ตุลาคม 2569" },
  { image: "news-warning.webp", title: "⚠️ ระวัง! มิจฉาชีพแอบอ้างเป็นพนักงาน PEA", date: "19 ตุลาคม 2569" },
  { image: "news-fake.webp", title: "PEA แนะนำช่องทางตรวจสอบข้อมูลและบริการออนไลน์อย่างปลอดภัย", date: "18 ตุลาคม 2569" },
  { image: "news-scam-call.webp", title: "รวมช่องทางติดต่อ PEA ที่ประชาชนควรรู้", date: "17 ตุลาคม 2569" },
  { image: "news-warning.webp", title: "แจ้งเตือนข่าวปลอมและวิธีสังเกตบัญชีทางการของ PEA", date: "16 ตุลาคม 2569" },
];

const outages = [
  ["เชียงใหม่", "บ้านใหม่หนองบัว หมู่ 10 ตำบลหนองบัว อำเภอไชยปราการ จังหวัดเชียงใหม่"],
  ["สระบุรี", "บริเวณตัดไลน์ปากท่อ หมู่ 1, 2, 3 ตำบลนพรัตน์ และหมู่ 9 ตำบลหนองโรง"],
  ["นครนายก", "หมู่ 12 ตำบลเขาพระ อำเภอเมืองนครนายก ซอยอ่างเก็บน้ำทรายทอง"],
  ["ชลบุรี", "บริเวณถนนสุขุมวิทและพื้นที่ใกล้เคียง ตำบลบ้านสวน อำเภอเมืองชลบุรี"],
  ["อุดรธานี", "บ้านหนองบัว หมู่ 4 ตำบลหมากแข้ง อำเภอเมืองอุดรธานี"],
  ["นครราชสีมา", "บริเวณถนนมิตรภาพ ช่วงแยกตลาดเซฟวัน และพื้นที่ใกล้เคียง"],
];

const knowledge = [
  { image: "savethai-solar.webp", tag: "ประหยัด", title: "ติดตั้งโซลาร์เซลล์ลดหย่อนภาษี 2569 ทางเลือกประหยัดไฟ เซฟภาษี", date: "7 ตุลาคม 2569" },
  { image: "savethai-ip.webp", tag: "เกร็ดน่ารู้", title: "ค่า IP คืออะไร? รู้จักมาตรฐานเครื่องใช้ไฟฟ้าปลอดภัยจากน้ำและฝุ่น", date: "6 ตุลาคม 2569" },
  { image: "savethai-ev.webp", tag: "เกร็ดน่ารู้", title: "คู่มือเตรียมความพร้อมติดตั้ง EV Charger ที่บ้าน อัปเดตครบทุกขั้นตอน", date: "5 ตุลาคม 2569" },
  { image: "savethai-solar.webp", tag: "ประหยัด", title: "เลือกขนาดโซลาร์เซลล์อย่างไรให้เหมาะกับบ้านและค่าไฟ", date: "4 ตุลาคม 2569" },
  { image: "savethai-ip.webp", tag: "ปลอดภัย", title: "ตรวจเช็กเครื่องใช้ไฟฟ้าก่อนหน้าฝน ลดความเสี่ยงไฟรั่ว", date: "3 ตุลาคม 2569" },
  { image: "savethai-ev.webp", tag: "ยานยนต์ไฟฟ้า", title: "ชาร์จรถ EV ที่บ้านให้ปลอดภัยและช่วยยืดอายุแบตเตอรี่", date: "2 ตุลาคม 2569" },
];

const procurements = [
  "จ้างเหมาบุคคลภายนอกปฏิบัติเกี่ยวกับมิเตอร์ กรณีงดจ่ายไฟผู้ใช้ไฟที่ค้างชำระค่าไฟฟ้า",
  "ประกวดราคาซื้อสายไฟ CABLE, AL, 750 V, 95 SQ.MM. สำหรับใช้งานในพื้นที่",
  "จ้างเหมาปฏิบัติงานวางหนังสือแจ้งเตือนก่อนการงดจ่ายไฟฟ้า",
  "จ้างเหมาบำรุงรักษาระบบไฟฟ้าและอุปกรณ์ประกอบในพื้นที่รับผิดชอบ",
  "ประกวดราคาจ้างก่อสร้างปรับปรุงระบบจำหน่ายไฟฟ้า ด้วยวิธีประกวดราคาอิเล็กทรอนิกส์",
];

const procurementSlides = [
  { image: "procurement-solar.webp", title: "การรับขึ้นทะเบียนผู้ประกอบการงานติดตั้ง สำหรับการดำเนินธุรกิจ PEA SOLAR" },
  { image: "procurement-grid-code.webp", title: "ข้อกำหนดเกี่ยวกับระบบโครงข่ายไฟฟ้า (Grid Code)" },
  { image: "procurement-save4.webp", title: "โครงการ PEA 1 Save 4 Baht เพื่อการใช้พลังงานอย่างมีประสิทธิภาพ" },
];

type CarouselProps = {
  children: ReactNode;
  className?: string;
  ariaLabel: string;
  loop?: boolean;
  autoplay?: boolean;
  showArrows?: boolean;
  showDots?: boolean;
  controlsClassName?: string;
};

function Carousel({ children, className = "", ariaLabel, loop = false, autoplay = false, showArrows = true, showDots = true, controlsClassName = "" }: CarouselProps) {
  const autoplayPlugin = useMemo(() => Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true }), []);
  const [viewportRef, emblaApi] = useEmblaCarousel(
    { align: "start", containScroll: "trimSnaps", loop, slidesToScroll: 1 },
    autoplay ? [autoplayPlugin] : [],
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateState = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setScrollSnaps(emblaApi.scrollSnapList());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", updateState).on("reInit", updateState);
    const frame = requestAnimationFrame(updateState);
    return () => {
      cancelAnimationFrame(frame);
      emblaApi.off("select", updateState).off("reInit", updateState);
    };
  }, [emblaApi, updateState]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();
  const slides = Children.toArray(children);

  return (
    <div className={`carousel ${className}`.trim()} aria-label={ariaLabel} role="region">
      <div className="carousel-viewport" ref={viewportRef}>
        <div className="carousel-container">{slides.map((slide, index) => <div className="carousel-slide" key={index}>{slide}</div>)}</div>
      </div>
      {(showDots || showArrows) && <div className={`carousel-controls ${controlsClassName}`.trim()}>
        {showDots && <div className="slider-dots">{scrollSnaps.map((_, index) => <button className={selectedIndex === index ? "active" : ""} aria-label={`ไปยังสไลด์ ${index + 1}`} aria-current={selectedIndex === index ? "true" : undefined} onClick={() => emblaApi?.scrollTo(index)} key={index} />)}</div>}
        {showArrows && <div className="carousel-arrows"><button aria-label="ก่อนหน้า" disabled={!loop && !canScrollPrev} onClick={scrollPrev}>‹</button><button aria-label="ถัดไป" disabled={!loop && !canScrollNext} onClick={scrollNext}>›</button></div>}
      </div>}
    </div>
  );
}

function SectionHeading({ eyebrow, title, href = "#" }: { eyebrow?: string; title: string; href?: string }) {
  return <div className="section-heading"><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2>{title}</h2></div><a href={href}>ดูทั้งหมด <span>›</span></a></div>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showCookie, setShowCookie] = useState(true);

  return (
    <main>
      <header className="site-header">
        <div className="shell header-main">
          <button className="mobile-menu" aria-label="เปิดเมนู" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><Icon name="menu" /></button>
          <a href="#top" className="header-logo" aria-label="NTOS"><img src={`${A}/ntos-logo.webp`} alt="NTOS" /></a>
          <a className="header-career" href="">สมัครงานกับ NTOS <Icon name="arrow" size={17} /></a>
          {/* <div className="header-tools"><button aria-label="เครื่องมือช่วยการเข้าถึง"><Icon name="person" size={20} /></button><button aria-label="ภาษาไทย"><Icon name="globe" size={20} /> TH</button><button aria-label="ค้นหา"><Icon name="search" size={21} /></button></div> */}
        </div>
        <div className="nav-bar">
          <div className="shell">
            <nav className={menuOpen ? "primary-nav open" : "primary-nav"}>
              <a href="#top">หน้าหลัก</a>
              <a href="#about">เกี่ยวกับเรา</a>
              <a href="#">ตำแหน่งงาน</a>
              <a href="#">ถามตอบ</a>
              <a href="#">ติดต่อเรา</a>
            </nav>
          </div>
        </div>
      </header>

      <section id="top" className="hero">
        <Carousel className="hero-carousel" ariaLabel="แบนเนอร์ประชาสัมพันธ์" loop autoplay showArrows={false}>
          {heroSlides.map((slide) => <picture key={slide.desktop}><source media="(max-width: 760px)" srcSet={`${A}/${slide.mobile}`} /><img src={`${A}/${slide.desktop}`} alt={slide.alt} /></picture>)}
        </Carousel>
      </section>

      <section id="services" className="services-section">
        <div className="shell">
          <div className="identity-heading">
            <span>ABOUT NT-OS</span>
            <h1>วิสัยทัศน์และพันธกิจ</h1>
            <p>รากฐานสำคัญที่ขับเคลื่อนทุกบริการของเรา</p>
          </div>

          <article className="vision-card">
            <div className="vision-mark" aria-hidden="true">“</div>
            <div><span>วิสัยทัศน์</span><h2>เราคือผู้ให้บริการ Outsourcing ผู้เป็นเลิศ<br />สำหรับธุรกิจ ICT และธุรกิจที่เกี่ยวเนื่อง</h2></div>
          </article>

          <div className="mission-block">
            <div className="mission-heading"><span>OUR MISSION</span><h2>พันธกิจ</h2></div>
            <div className="mission-grid">
              {missions.map((mission, index) => <article className="mission-card" key={mission}><b>{String(index + 1).padStart(2, "0")}</b><p>{mission}</p></article>)}
            </div>
          </div>

          <div className="culture-heading"><span>OUR COMMITMENT</span><h2>สิ่งที่เรายึดมั่น</h2></div>
          <Carousel className="culture-carousel" ariaLabel="สิ่งที่ NT OS ยึดมั่น" controlsClassName="track-controls">
            {ntosValues.map((item) => <article className={`culture-card ${item.tone}`} key={item.title}><div className="culture-card-top"><span>{item.type}</span><b aria-hidden="true">NTOS</b></div><h3>{item.title}</h3><p>{item.detail}</p><i aria-hidden="true" /></article>)}
          </Carousel>
        </div>
      </section>

      {/* <section id="news" className="news-section page-section">
        <div className="shell">
          <div className="news-tabs"><button className="active">ข่าวประชาสัมพันธ์</button><button>Infographic</button></div>
          <SectionHeading title="อัปเดตข่าวสาร" href="https://www.pea.co.th/news" />
          <Carousel className="news-carousel" ariaLabel="ข่าวสาร" showDots={false} controlsClassName="round-controls">
            {news.map((item) => <article className="news-card" key={item.title}><img src={`${A}/${item.image}`} alt={item.title} /><small>ข่าวสารองค์กร</small><h3>{item.title}</h3><div className="card-date"><Icon name="calendar" size={13} />{item.date}</div></article>)}
          </Carousel>
        </div>
      </section>

      <section className="outage-section page-section">
        <div className="shell outage-card">
          <div className="outage-title"><b>ประกาศดับไฟฟ้า</b><span>21 ต.ค. 2569</span></div>
          <Carousel className="outage-carousel" ariaLabel="ประกาศดับไฟฟ้า" showArrows={false} controlsClassName="outage-bottom">
            {outages.map(([province, detail]) => <a href="https://eservice.pea.co.th" key={province}><h3>{province}</h3><p>{detail}</p><span>ดูรายละเอียด</span></a>)}
          </Carousel>
          <a className="outage-all" href="https://eservice.pea.co.th">ดูทั้งหมด ›</a>
        </div>
      </section>

      <section id="knowledge" className="knowledge-section page-section">
        <div className="shell">
          <SectionHeading title="เซฟไทย by PEA" href="https://safesavethai.com" />
          <Carousel className="knowledge-carousel" ariaLabel="บทความเซฟไทย" showDots={false} controlsClassName="round-controls">
            {knowledge.map((item) => <article className="knowledge-card" key={item.title}><img src={`${A}/${item.image}`} alt={item.title} /><small>{item.tag}</small><h3>{item.title}</h3><div className="card-date"><Icon name="calendar" size={13} />{item.date}</div></article>)}
          </Carousel>
        </div>
      </section>

      <section className="privilege-section page-section">
        <div className="shell">
          <Carousel className="privilege-carousel" ariaLabel="สิทธิประโยชน์ลูกค้า" controlsClassName="privilege-controls">
            <a href="#" className="privilege-card privilege-corporate"><img className="privilege-bg" src={`${A}/privilege-bg.webp`} alt="" /><img className="privilege-logo" src={`${A}/privilege-logo.webp`} alt="PEA Privilege" /><p>รับส่วนลดค่าบริการเสริมจาก PEA<br /><span>พร้อมสิทธิประโยชน์ที่คัดสรรมาเพื่อองค์กรและธุรกิจของคุณ</span></p><b>ดูรายละเอียด ›</b><em>ลูกค้านิติบุคคล</em></a>
            <a href="#" className="privilege-card privilege-personal"><img className="privilege-bg" src={`${A}/wattd-bg.webp`} alt="" /><img className="privilege-logo" src={`${A}/wattd-logo.webp`} alt="Watt-D Point" /><p>สะสมคะแนน แลกรับคืนค่าไฟฟ้า<br /><span>กับวัตต์-ดี พอยท์ ได้ทุกเดือน</span></p><b>ดูรายละเอียด ›</b><em>ลูกค้าบุคคล</em></a>
          </Carousel>
        </div>
      </section>

      <section className="procurement-section page-section">
        <div className="shell procurement-grid">
          <div className="procurement-panel"><div className="procurement-tabs"><button className="active">ประกาศจัดซื้อจัดจ้าง</button><button>ประกาศจำหน่ายพัสดุ</button></div>{procurements.map((item) => <a href="https://eprocurement.pea.co.th" key={item}><h3>{item}</h3><p>ประกวดราคาอิเล็กทรอนิกส์ (e-bidding) · วันที่ขายแบบ 18–25 ตุลาคม 2569</p></a>)}<a className="all-link" href="https://eprocurement.pea.co.th">ดูประกาศทั้งหมด ›</a></div>
          <Carousel className="procurement-carousel procurement-feature" ariaLabel="ประกาศสำคัญ" showArrows={false}>
            {procurementSlides.map((item) => <article className="procurement-slide" key={item.image}><img src={`${A}/${item.image}`} alt={item.title} /><h3>{item.title}</h3></article>)}
          </Carousel>
        </div>
      </section>

      <div className="quick-links"><a href="#services">บริการออนไลน์</a><a href="#services">สอบถามประวัติการใช้ไฟฟ้า</a><a href="https://eservice.pea.co.th">ช่องทางชำระค่าไฟฟ้า</a><a href="#knowledge">ดาวน์โหลดแบบฟอร์ม</a><a href="#">ปฏิทิน Off-Peak</a></div>

      <footer id="about" className="footer">
        <div className="shell footer-main">
          <div className="footer-columns"><div><h3>บริการของเรา</h3><a href="#services">ลูกค้าบ้านอยู่อาศัย</a><a href="#services">ลูกค้าธุรกิจ/อุตสาหกรรม/ราชการ</a><a href="#services">พลังงานสะอาด/ยานยนต์ไฟฟ้า</a><a href="#services">ตรวจสอบ/บำรุงรักษาระบบไฟฟ้า</a><a href="#services">บริการอื่น ๆ</a></div><div><h3>เกี่ยวกับองค์กร</h3><a href="#about">ธุรกิจและบริการของ PEA</a><a href="#about">การกำกับดูแลองค์กรที่ดี</a><a href="#about">การพัฒนาความยั่งยืน</a><a href="#about">โครงสร้างพื้นฐาน</a></div><div><h3>ข่าวสารประกาศ</h3><a href="#news">ข่าวประชาสัมพันธ์</a><a href="#news">ประกาศดับไฟฟ้า</a><a href="#news">ประกาศจัดซื้อจัดจ้าง</a><a href="#news">ประกาศ FTV</a></div><div><h3>บริการช่วยเหลือ</h3><a href="#">ติดต่อเรา</a><a href="#">ค้นหาสาขาและจุดให้บริการ</a><a href="#">คำถามที่พบบ่อย</a><a href="#">แจ้งเหตุไฟฟ้าขัดข้อง</a></div></div>
          <div className="footer-contact"><img src={`${A}/pea-66-logo.png`} alt="PEA 66 Years of Trust" /><h3>การไฟฟ้าส่วนภูมิภาค</h3><p>“ไฟฟ้าอัจฉริยะ เพื่อคุณภาพชีวิตที่ยั่งยืน”</p><b>ติดตามข่าวสารของเรา</b><div className="socials"><span>f</span><span>◎</span><span>𝕏</span><span>▶</span><span>♪</span><span>LINE</span></div><strong><Icon name="phone" size={16} /> 1129 PEA Contact Center</strong></div>
        </div>
        <div className="shell footer-bottom"><span>© สงวนลิขสิทธิ์ 2568 การไฟฟ้าส่วนภูมิภาค</span><div><a href="#">นโยบายเว็บไซต์</a><a href="#">นโยบายการรักษาความมั่นคงปลอดภัย</a><a href="#">การปฏิเสธการรับผิด</a><a href="#">นโยบายคุ้มครองข้อมูลส่วนบุคคล</a></div></div>
      </footer>

      {showCookie && <aside className="cookie-banner"><button className="cookie-close" aria-label="ปิด" onClick={() => setShowCookie(false)}>×</button><h3>เว็บไซต์นี้ใช้คุกกี้</h3><p>เราใช้คุกกี้เพื่อเพิ่มประสิทธิภาพ และประสบการณ์ที่ดีในการใช้งานเว็บไซต์ รวมถึงเพื่อวิเคราะห์การเข้าใช้งานเว็บไซต์และทำความเข้าใจว่าผู้ใช้งานมาจากที่ใด คุณสามารถเลือกตั้งค่าความยินยอมการใช้คุกกี้ได้ โดยคลิก “ตั้งค่าคุกกี้” <a href="https://www.pea.co.th/cookie-policy">นโยบายคุกกี้</a></p><div><button>ตั้งค่าคุกกี้</button><button>ยอมรับทั้งหมด</button></div></aside>}
      <a className="live-chat" href="https://www.pea.co.th/contact-us"><img src={`${A}/live-chat.webp`} alt="Live Chat กับ 1129" /></a> */}
    </main>
  );
}
