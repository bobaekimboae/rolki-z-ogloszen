import { useEffect, useRef, useState } from "react";

const ASSET = import.meta.env.BASE_URL;
const formats = [
  { id: "magazine", name: "매거진", ratio: "9:16", image: `${ASSET}reference/magazine.webp`, detail: "자동차 매거진처럼 9개 장면으로 소개" },
  { id: "card", name: "카드", ratio: "9:16", image: `${ASSET}reference/karta.webp`, detail: "핵심 정보를 카드로 보여주는 구성" },
  { id: "bento", name: "벤토", ratio: "9:16", image: `${ASSET}reference/bento.webp`, detail: "사진과 장점을 격자 레이아웃으로 구성" },
  { id: "reasons", name: "5가지 이유", ratio: "9:16", image: `${ASSET}reference/powody.webp`, detail: "차량을 선택할 이유를 순서대로 소개" },
  { id: "new", name: "신규 매물", ratio: "9:16", image: `${ASSET}reference/teaser.webp`, detail: "새로 들어온 매물 홍보" },
  { id: "facts", name: "차량 정보", ratio: "9:16", image: `${ASSET}reference/lista.webp`, detail: "주요 제원을 간결하게 정리" },
  { id: "feed34", name: "세로 게시물", ratio: "3:4", image: `${ASSET}reference/feed34.webp`, detail: "피드에 맞춘 3:4 게시물" },
  { id: "feed11", name: "정사각 게시물", ratio: "1:1", image: `${ASSET}reference/feed11.webp`, detail: "인스타그램용 정사각 게시물" },
  { id: "panorama", name: "와이드", ratio: "16:9", image: `${ASSET}reference/panorama.webp`, detail: "가로 화면용 파노라마" },
];

const musicOptions = [
  ["auto", "자동 추천", "차량 분위기에 어울리는 경쾌한 신스"],
  ["bright", "밝고 경쾌하게", "가볍고 산뜻한 리듬"],
  ["pop", "팝", "경쾌한 박수와 팝 비트"],
  ["warm", "따뜻하게", "기타와 피아노의 편안한 분위기"],
  ["acoustic", "어쿠스틱", "차분하고 자연스러운 기타"],
  ["urban", "도시적", "세련된 도심의 리듬"],
  ["sport", "스포티", "에너지 있는 드럼"],
  ["rock", "기타 록", "힘 있는 기타 사운드"],
  ["offroad", "오프로드", "모험적인 타악기"],
  ["electric", "일렉트로닉", "깨끗하고 현대적인 전자음"],
  ["retro", "레트로", "빈티지한 펑크 리듬"],
  ["night", "나이트 드라이브", "밤의 신스웨이브"],
  ["elegant", "우아하게", "피아노와 현악기"],
  ["luxury", "프리미엄", "차분하고 고급스러운 사운드"],
  ["house", "하우스", "스타일리시한 댄스 비트"],
  ["cinematic", "시네마틱", "웅장한 영화 예고편 분위기"],
  ["none", "음악 없음", "영상에 배경 음악을 넣지 않음"],
];

const fontOptions = ["프라운세스", "인터", "몬세라트", "사이라", "바를로", "아르키보", "오스왈드"];
const fontFamilies = {
  프라운세스: "Fraunces, Georgia, serif", 인터: "Inter, Arial, sans-serif", 몬세라트: "Montserrat, Arial, sans-serif",
  사이라: "Saira, Arial, sans-serif", 바를로: "Barlow, Arial, sans-serif", 아르키보: "Archivo, Arial, sans-serif", 오스왈드: "Oswald, Arial, sans-serif",
};

function formatMoney(value) {
  const number = Number(String(value || "").replace(/[^\d]/g, ""));
  return number ? `${new Intl.NumberFormat("ko-KR").format(number)}원` : "가격 문의";
}

function makeAudioTrack(audioContext, destination, kind) {
  if (kind === "none") return () => {};
  const master = audioContext.createGain();
  master.gain.value = 0.035;
  master.connect(destination);
  const nodes = [];
  const chord = kind === "sport" ? [110, 164.81, 220] : kind === "elegant" || kind === "luxury" ? [174.61, 220, 261.63] : [130.81, 164.81, 196];
  chord.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = index === 0 ? "triangle" : "sine";
    oscillator.frequency.value = frequency;
    gain.gain.value = index === 0 ? 0.55 : 0.22;
    oscillator.connect(gain).connect(master);
    oscillator.start();
    nodes.push(oscillator);
  });
  return () => { nodes.forEach((node) => { try { node.stop(); } catch {} }); master.disconnect(); };
}

function useObjectUrls(files) {
  const [urls, setUrls] = useState([]);
  useEffect(() => {
    const next = files.map((file) => URL.createObjectURL(file));
    setUrls(next);
    return () => next.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);
  return urls;
}

function ReelPreview({ data, photoUrls, activeFormat, accent, font, onSelectFormat }) {
  const chosen = formats.find((format) => format.id === activeFormat) || formats[0];
  const cover = photoUrls[0] || chosen.image;
  const title = [data.make, data.model].filter(Boolean).join(" ") || "나의 새 차량";
  return (
    <aside className="preview-column" aria-label="영상 미리보기">
      <div className="preview-device" style={{ "--accent": accent, fontFamily: fontFamilies[font] }}>
        <img className="preview-cover" src={cover} alt={`${title} 미리보기`} />
        <div className="preview-scrim" />
        <div className="preview-topline"><span>매물 브리핑</span><span>01 / 09</span></div>
        <div className="preview-copy">
          <span className="preview-kicker">{data.year || "차량 연식"} · {data.body || "중고차"}</span>
          <h2>{title}</h2>
          <p>{data.mileage ? `${new Intl.NumberFormat("ko-KR").format(Number(data.mileage))}km` : "주행거리 확인"} · {data.fuel || "연료 정보"}</p>
          <strong>{formatMoney(data.price)}</strong>
        </div>
        <div className="preview-bottom"><span>{data.seller || "판매자"}</span><span className="accent-dot" /></div>
      </div>
      <p className="preview-caption">{chosen.name} · {chosen.ratio} · {photoUrls.length ? "내 사진으로 미리보기" : "예시 이미지"}</p>
      <div className="preview-thumbs" aria-label="영상 형식 미리보기">
        {formats.filter((format) => ["magazine", "card", "bento", "reasons"].includes(format.id)).map((format) => (
          <button key={format.id} type="button" className={`thumb ${activeFormat === format.id ? "selected" : ""}`} onClick={() => onSelectFormat(format.id)} aria-label={`${format.name} 미리보기`}>
            <img src={format.image} alt="" /><span>{format.name}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}

function SectionTitle({ number, title, note }) {
  return <div className="section-title"><span className="step-dot">{number}</span><div><h2>{title}</h2>{note && <p>{note}</p>}</div></div>;
}

export function App() {
  const [source, setSource] = useState("listing");
  const [listingUrl, setListingUrl] = useState("");
  const [urlNotice, setUrlNotice] = useState("");
  const [files, setFiles] = useState([]);
  const photoUrls = useObjectUrls(files);
  const [data, setData] = useState({ make: "", model: "", year: "", mileage: "", power: "", price: "", color: "", fuel: "", transmission: "", body: "SUV", seller: "개인", sellerName: "", description: "", strengths: ["", "", "", "", ""] });
  const [selectedFormats, setSelectedFormats] = useState(["magazine", "card", "bento", "reasons"]);
  const [stories, setStories] = useState(true);
  const [font, setFont] = useState("프라운세스");
  const [palette, setPalette] = useState("brand");
  const [customAccent, setCustomAccent] = useState("#94b8a5");
  const [music, setMusic] = useState("auto");
  const [previewFormat, setPreviewFormat] = useState("magazine");
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [rendering, setRendering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoResults, setVideoResults] = useState([]);
  const [error, setError] = useState("");
  const [dragIndex, setDragIndex] = useState(-1);
  const inputRef = useRef(null);
  const videoRef = useRef(null);
  const accent = palette === "paper" ? "#e9dec6" : palette === "custom" ? customAccent : "#a4bca5";
  const chosenFormats = selectedFormats.map((id) => formats.find((item) => item.id === id)).filter(Boolean);
  const storyFormat = stories ? { ...(chosenFormats.find((item) => item.ratio === "9:16") || formats[0]), id: "story", name: "스토리", ratio: "9:16" } : null;
  const outputFormats = storyFormat ? [...chosenFormats, storyFormat] : chosenFormats;
  const totalDeliverables = outputFormats.length;
  const estimatedSeconds = Math.max(5, Math.ceil(totalDeliverables * Math.max(1, files.length) * 2.4));
  const estimatedTime = estimatedSeconds >= 60 ? `약 ${Math.ceil(estimatedSeconds / 60)}분` : `약 ${estimatedSeconds}초`;
  const title = [data.make, data.model].filter(Boolean).join(" ") || "나의 새 차량";

  useEffect(() => () => videoResults.forEach((result) => URL.revokeObjectURL(result.url)), [videoResults]);

  const setField = (key, value) => setData((current) => ({ ...current, [key]: value }));

  function addFiles(fileList) {
    const accepted = Array.from(fileList || []).filter((file) => /^image\/(jpeg|png|webp)$/.test(file.type));
    const oversized = accepted.filter((file) => file.size > 20 * 1024 * 1024);
    const safe = accepted.filter((file) => file.size <= 20 * 1024 * 1024);
    setError(oversized.length ? "사진 한 장은 20MB 이하로 선택해 주세요." : "");
    setFiles((current) => [...current, ...safe].slice(0, 40));
  }

  async function loadSamplePhotos() {
    try {
      const samples = await Promise.all(["yeti-front.webp", "yeti-rear.webp", "yeti-interior.webp"].map(async (name, index) => {
        const response = await fetch(`${ASSET}reference/${name}`);
        if (!response.ok) throw new Error("예시 사진을 불러오지 못했습니다.");
        return new File([await response.blob()], `예시-차량-${index + 1}.webp`, { type: "image/webp" });
      }));
      setFiles((current) => [...current, ...samples].slice(0, 40));
      setError("");
    } catch { setError("예시 사진을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."); }
  }

  function toggleFormat(id) {
    setSelectedFormats((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    setPreviewFormat(id);
  }

  function reorderPhotos(from, to) {
    if (from < 0 || to < 0 || from === to) return;
    setFiles((current) => { const next = [...current]; const [moved] = next.splice(from, 1); next.splice(to, 0, moved); return next; });
  }

  async function readListing() {
    setUrlNotice("");
    if (!listingUrl.trim()) { setUrlNotice("차량 매물 주소를 입력해 주세요."); return; }
    try {
      const url = new URL(listingUrl.trim());
      if (!/^https?:$/.test(url.protocol)) throw new Error("주소 형식을 확인해 주세요.");
      setUrlNotice("브라우저 보안 정책상 외부 매물 정보를 직접 읽을 수 없습니다. 사진을 업로드하고 차량 정보를 입력해 주세요.");
    } catch (e) { setUrlNotice(e.message || "올바른 웹 주소를 입력해 주세요."); }
  }

  function drawPoster(ctx, image, format, index, total, time, W, H) {
    const scale = Math.max(W / image.width, H / image.height) * (1.02 + 0.055 * time);
    const w = image.width * scale; const h = image.height * scale;
    const pan = Math.sin(time * Math.PI) * 18;
    ctx.fillStyle = "#101312"; ctx.fillRect(0, 0, W, H);
    ctx.drawImage(image, (W - w) / 2 + pan, (H - h) / 2, w, h);
    const overlay = ctx.createLinearGradient(0, 0, 0, H);
    overlay.addColorStop(0, "rgba(0,0,0,.3)"); overlay.addColorStop(0.35, "rgba(0,0,0,.04)"); overlay.addColorStop(0.62, "rgba(0,0,0,.12)"); overlay.addColorStop(1, "rgba(0,0,0,.82)");
    ctx.fillStyle = overlay; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = accent; ctx.fillRect(75, 104, 48, 8);
    const kicker = format.id === "reasons" ? "선택 포인트" : format.id === "new" ? "새 매물" : format.id === "facts" ? "차량 정보" : "매물 브리핑";
    ctx.fillStyle = "rgba(255,255,255,.9)"; ctx.font = "600 30px Inter, Arial, sans-serif"; ctx.fillText(`${kicker}   ${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`, 75, 172);
    ctx.fillStyle = "#fff"; ctx.font = `700 ${format.id === "magazine" ? 76 : 65}px ${fontFamilies[font] || "Inter, Arial, sans-serif"}`;
    const words = title.split(" "); let line = ""; const lines = [];
    for (const word of words) { const trial = line ? `${line} ${word}` : word; if (ctx.measureText(trial).width > 920 && line) { lines.push(line); line = word; } else line = trial; }
    if (line) lines.push(line);
    lines.slice(0, 2).forEach((item, lineIndex) => ctx.fillText(item, 75, H - 485 + lineIndex * 86));
    ctx.fillStyle = "rgba(255,255,255,.86)"; ctx.font = "500 30px Inter, Arial, sans-serif";
    const strengths = data.strengths.filter(Boolean);
    const basicFacts = [data.mileage && `${new Intl.NumberFormat("ko-KR").format(Number(data.mileage))}km`, data.fuel, data.transmission, data.color].filter(Boolean).join("  ·  ");
    const facts = format.id === "reasons" ? strengths[index % Math.max(1, strengths.length)] || `매력 포인트 ${index + 1}` : format.id === "facts" ? [data.year && `${data.year}년식`, data.power && `${data.power}마력`, basicFacts].filter(Boolean).join("  ·  ") : basicFacts;
    ctx.fillText(facts || "차량 상태를 직접 확인해 보세요", 78, H - 270);
    ctx.fillStyle = accent; ctx.font = "700 55px Inter, Arial, sans-serif"; ctx.fillText(formatMoney(data.price), 75, H - 180);
    ctx.fillStyle = "rgba(255,255,255,.88)"; ctx.font = "500 26px Inter, Arial, sans-serif"; ctx.fillText(`${data.sellerName || data.seller || "판매자"}  ·  자세한 내용은 문의해 주세요`, 78, H - 100);
    const width = W - 150; ctx.fillStyle = "rgba(255,255,255,.32)"; ctx.fillRect(75, H - 45, width, 6); ctx.fillStyle = accent; ctx.fillRect(75, H - 45, width * ((index + time) / total), 6);
  }

  async function generateVideo() {
    setError(""); setSummaryOpen(false);
    if (!files.length) { setError("영상에 넣을 차량 사진을 한 장 이상 추가해 주세요."); document.getElementById("photos")?.scrollIntoView({ behavior: "smooth", block: "center" }); return; }
    if (!selectedFormats.length) { setError("영상 형식을 하나 이상 선택해 주세요."); return; }
    const canvas = document.createElement("canvas"); canvas.width = 1080; canvas.height = 1920;
    const ctx = canvas.getContext("2d");
    if (!ctx || !canvas.captureStream || !window.MediaRecorder) { setError("이 브라우저에서는 영상 제작을 지원하지 않습니다. 최신 Chrome 또는 Edge를 이용해 주세요."); return; }
    setRendering(true); setProgress(0); setVideoResults([]); setSummaryOpen(true);
    const loaded = await Promise.all(files.map((file) => createImageBitmap(file).catch(() => null)));
    const images = loaded.filter(Boolean);
    if (!images.length) { setRendering(false); setError("선택한 사진을 읽을 수 없습니다. JPG, PNG 또는 WebP 파일을 사용해 주세요."); return; }
    const mimeType = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"].find((type) => MediaRecorder.isTypeSupported(type)) || "";
    const secondsPerImage = 2.4;
    const completedResults = [];
    try {
      for (let formatIndex = 0; formatIndex < outputFormats.length; formatIndex += 1) {
        const format = outputFormats[formatIndex];
        const [width, height] = format.ratio === "16:9" ? [1920, 1080] : format.ratio === "1:1" ? [1080, 1080] : format.ratio === "3:4" ? [1080, 1440] : [1080, 1920];
        canvas.width = width; canvas.height = height;
        const stream = canvas.captureStream(24);
        let audioContext; let stopMusic = () => {};
        if (music !== "none") {
          try { audioContext = new AudioContext(); const audioDestination = audioContext.createMediaStreamDestination(); stopMusic = makeAudioTrack(audioContext, audioDestination, music); audioDestination.stream.getAudioTracks().forEach((track) => stream.addTrack(track)); await audioContext.resume(); } catch { /* 영상은 무음으로 계속 제작 */ }
        }
        const recorder = new MediaRecorder(stream, mimeType ? { mimeType, videoBitsPerSecond: 5_000_000 } : undefined);
        const chunks = [];
        const finished = new Promise((resolve, reject) => {
          recorder.onerror = () => reject(new Error("영상 인코딩 중 오류가 발생했습니다."));
          recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
          recorder.onstop = async () => { stopMusic(); if (audioContext) await audioContext.close().catch(() => {}); stream.getTracks().forEach((track) => track.stop()); resolve(new Blob(chunks, { type: recorder.mimeType || "video/webm" })); };
        });
        const duration = images.length * secondsPerImage; const startedAt = performance.now();
        recorder.start(250);
        await new Promise((resolve) => {
          const animate = (now) => {
            const elapsed = (now - startedAt) / 1000;
            const index = Math.min(images.length - 1, Math.floor(elapsed / secondsPerImage));
            const local = Math.min(1, (elapsed - index * secondsPerImage) / secondsPerImage);
            drawPoster(ctx, images[index], format, index, images.length, local, canvas.width, canvas.height);
            setProgress(Math.min(99, Math.round(((formatIndex + Math.min(1, elapsed / duration)) / outputFormats.length) * 100)));
            if (elapsed >= duration) { recorder.stop(); resolve(); return; }
            requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        });
        completedResults.push({ format, blob: await finished });
      }
      images.forEach((image) => image.close?.());
      setVideoResults(completedResults.map((item) => ({ ...item, url: URL.createObjectURL(item.blob) })));
      setRendering(false); setProgress(100);
    } catch (renderError) {
      images.forEach((image) => image.close?.()); setRendering(false);
      setError(renderError.message || "영상 제작을 마치지 못했습니다. 사진 수를 줄여 다시 시도해 주세요.");
    }
  }

  async function testMusic(id) {
    if (id === "none") return;
    try { const context = new AudioContext(); const output = context.destination; const stop = makeAudioTrack(context, output, id); window.setTimeout(() => { stop(); context.close(); }, 850); await context.resume(); } catch { /* audio preview needs user gesture */ }
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="롤키 홈"><span className="brand-mark"><i /></span><span>Rolki z ogłoszeń <em>매물 숏폼</em></span></a>
        <nav><a href="#how">이용 방법</a><a href="#dealers">매매상사</a><a href="#account">계정</a><a className="header-cta" href="#top">영상 만들기</a></nav>
      </header>

      <main id="top" className="page-wrap">
        <div className="page-heading"><p className="eyebrow">차량 매물을 위한 영상 제작 도구</p><h1>새로운 숏폼 만들기</h1><p className="page-intro">차량과 사진을 넣고, 형식과 스타일을 고른 뒤 주문 내용을 확인하세요.<br className="desktop-only" /> 모든 항목은 원하는 대로 바꿀 수 있습니다.</p></div>

        <div className="work-grid">
          <div className="form-column">
            <section className="panel" id="car">
              <SectionTitle number="1" title="차량 정보" note="사진과 차량 정보를 입력해 영상에 담아 보세요." />
              <div className="source-tabs" role="tablist" aria-label="차량 정보 입력 방식">
                <button type="button" role="tab" aria-selected={source === "listing"} className={source === "listing" ? "active" : ""} onClick={() => setSource("listing")}>매물 링크 붙여넣기</button>
                <button type="button" role="tab" aria-selected={source === "upload"} className={source === "upload" ? "active" : ""} onClick={() => setSource("upload")}>사진 직접 올리기</button>
              </div>
              {source === "listing" && <div className="listing-import"><label htmlFor="listing-url">매물 페이지 주소</label><div className="url-row"><input id="listing-url" value={listingUrl} onChange={(e) => setListingUrl(e.target.value)} placeholder="https://" inputMode="url"/><button className="secondary-button" type="button" onClick={readListing}>주소 확인</button></div><p>외부 사이트의 사진 자동 가져오기는 사이트 접근 정책에 따라 제한될 수 있습니다.</p>{urlNotice && <p className="notice">{urlNotice}</p>}</div>}
              <div className="upload-zone" id="photos" role="button" tabIndex="0" onClick={() => inputRef.current?.click()} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}>
                <span className="plus-icon">+</span><div><strong>차량 사진 추가</strong><p>JPG, PNG 또는 WebP · 사진 1~40장 · 한 장당 최대 20MB</p></div><input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(e) => addFiles(e.target.files)} />
              </div>
              <div className="photo-meta"><span>{files.length} / 40장</span><span>앞·옆·뒤·실내·계기판 사진이 있으면 좋아요.</span><button type="button" className="sample-load" onClick={loadSamplePhotos}>예시 사진 3장 불러오기</button></div>
              {photoUrls.length > 0 && <div className="photo-grid">{photoUrls.map((url, index) => <div className="photo-thumb" key={`${files[index]?.name}-${index}`} draggable onDragStart={() => setDragIndex(index)} onDragOver={(e) => e.preventDefault()} onDrop={() => { reorderPhotos(dragIndex, index); setDragIndex(-1); }}><img src={url} alt={`차량 사진 ${index + 1}`} /><span className="photo-index">{index + 1}</span><button type="button" aria-label={`${files[index].name} 삭제`} onClick={() => setFiles((current) => current.filter((_, i) => i !== index))}>×</button></div>)}</div>}
              <div className="field-grid three">
                <label>제조사<input value={data.make} onChange={(e) => setField("make", e.target.value)} placeholder="예: BMW" /></label>
                <label>모델·세부 트림<input value={data.model} onChange={(e) => setField("model", e.target.value)} placeholder="예: X4 20i M Sport" /></label>
                <label>연식<input inputMode="numeric" value={data.year} onChange={(e) => setField("year", e.target.value)} placeholder="예: 2022" /></label>
                <label>주행거리 (km)<input inputMode="numeric" value={data.mileage} onChange={(e) => setField("mileage", e.target.value.replace(/[^\d]/g, ""))} placeholder="예: 30,000" /></label>
                <label>출력 (마력)<input inputMode="numeric" value={data.power} onChange={(e) => setField("power", e.target.value.replace(/[^\d]/g, ""))} placeholder="예: 184" /></label>
                <label>판매 가격 (원)<input inputMode="numeric" value={data.price} onChange={(e) => setField("price", e.target.value.replace(/[^\d]/g, ""))} placeholder="예: 42,000,000" /></label>
                <label>차량 색상<input value={data.color} onChange={(e) => setField("color", e.target.value)} placeholder="예: 미네랄 화이트" /></label>
                <label>연료<select value={data.fuel} onChange={(e) => setField("fuel", e.target.value)}><option value="">선택하세요</option><option>휘발유</option><option>디젤</option><option>하이브리드</option><option>전기</option><option>LPG</option><option>기타</option></select></label>
                <label>변속기<select value={data.transmission} onChange={(e) => setField("transmission", e.target.value)}><option value="">선택하세요</option><option>자동</option><option>수동</option><option>CVT</option><option>DCT</option></select></label>
              </div>
              <div className="strengths-block"><div className="block-label">차량의 주요 장점 <small>입력한 문구가 영상에 그대로 표시됩니다.</small></div><div className="field-grid two">{data.strengths.map((value, index) => <input key={index} aria-label={`차량 장점 ${index + 1}`} value={value} onChange={(e) => setData((current) => ({ ...current, strengths: current.strengths.map((item, i) => i === index ? e.target.value : item) }))} placeholder={["예: 1인 소유", "예: 정기 점검 완료", "예: 무사고", "예: 신품 타이어", "예: 파노라마 선루프"][index]} />)}</div></div>
              <label className="full-field">추가 설명<textarea rows="3" value={data.description} onChange={(e) => setField("description", e.target.value)} placeholder="차량의 특징이나 구매자가 알아야 할 내용을 적어 주세요." /></label>
              <div className="seller-row"><span>판매자 유형</span><label><input type="radio" checked={data.seller === "개인"} onChange={() => setField("seller", "개인")} /> 개인</label><label><input type="radio" checked={data.seller === "딜러"} onChange={() => setField("seller", "딜러")} /> 딜러·매매상사</label><input className="seller-name" value={data.sellerName} onChange={(e) => setField("sellerName", e.target.value)} placeholder="상호 또는 이름 (선택)" /></div>
            </section>

            <section className="panel" id="formats">
              <SectionTitle number="2" title="영상 형식" note="여러 가지 형식을 함께 선택할 수 있어요." />
              <p className="section-helper">세로형 영상 4종이 기본 선택되어 있습니다. 추가 형식과 스토리 버전은 자유롭게 선택하세요.</p>
              <div className="format-grid">{formats.map((format) => <button type="button" key={format.id} className={`format-card ${selectedFormats.includes(format.id) ? "chosen" : ""}`} onClick={() => toggleFormat(format.id)} onMouseEnter={() => setPreviewFormat(format.id)} onFocus={() => setPreviewFormat(format.id)} aria-pressed={selectedFormats.includes(format.id)}><span className="format-check">{selectedFormats.includes(format.id) ? "✓" : "+"}</span><img src={format.image} alt="" /><span className="format-info"><strong>{format.name}</strong><small>{format.ratio} · {format.detail}</small></span></button>)}</div>
              <label className="option-row"><span><strong>스토리 버전도 만들기</strong><small>선택한 영상 형식을 스토리용으로 함께 준비합니다.</small></span><input type="checkbox" checked={stories} onChange={(e) => setStories(e.target.checked)} /></label>
            </section>

            <section className="panel" id="style">
              <SectionTitle number="3" title="영상 스타일" note="글꼴과 색상, 배경 음악을 골라 보세요." />
              <div className="style-subhead"><h3>글꼴</h3><span>선택한 글꼴은 모든 장면에 적용됩니다.</span></div>
              <div className="font-options">{fontOptions.map((item) => <button key={item} type="button" className={`font-option ${font === item ? "selected" : ""}`} onClick={() => setFont(item)} style={{ fontFamily: fontFamilies[item] }}>{item}<span>가나다</span></button>)}</div>
              <div className="style-subhead"><h3>색상 스타일</h3></div>
              <div className="palette-options"><button type="button" className={palette === "brand" ? "selected" : ""} onClick={() => setPalette("brand")}><i style={{ background: "#a4bca5" }} />차량 브랜드 색상</button><button type="button" className={palette === "paper" ? "selected" : ""} onClick={() => setPalette("paper")}><i style={{ background: "#e9dec6" }} />따뜻한 종이 색상</button><label className={`palette-custom ${palette === "custom" ? "selected" : ""}`}><input aria-label="직접 색상 선택" type="color" value={customAccent} onChange={(e) => { setCustomAccent(e.target.value); setPalette("custom"); }} />직접 선택</label></div>
              <div className="style-subhead music-title"><h3>배경 음악</h3><span>음악이 없는 영상도 만들 수 있습니다.</span></div>
              <div className="music-grid">{musicOptions.map(([id, name, detail]) => <div className={`music-option ${music === id ? "selected" : ""}`} key={id}><button type="button" className="music-pick" onClick={() => setMusic(id)} aria-pressed={music === id}><span><strong>{name}</strong><small>{detail}</small></span><span className="selected-indicator">{music === id ? "✓" : ""}</span></button>{id !== "none" && <button type="button" className="play-sound" onClick={() => testMusic(id)} aria-label={`${name} 음악 미리 듣기`}>▶</button>}</div>)}</div>
              <p className="privacy-note">사진은 이 기기에서 영상 제작에 사용됩니다. 선택한 자료를 서버에 업로드하지 않습니다.</p>
            </section>

            <div className="desktop-summary"><div><strong>{totalDeliverables}개 결과물 · {estimatedTime}</strong><p>영상은 브라우저에서 제작되며, 완성 후 바로 내려받을 수 있습니다.</p></div><button type="button" className="primary-button" onClick={() => setSummaryOpen(true)}>주문 내용 확인</button></div>
          </div>
          <ReelPreview data={data} photoUrls={photoUrls} activeFormat={previewFormat} accent={accent} font={font} onSelectFormat={setPreviewFormat} />
        </div>
      </main>

      <footer className="site-footer" id="how"><div><strong>Rolki z ogłoszeń · 매물 숏폼</strong><p>입력한 차량 정보만 사용하며, 사진을 임의로 보정하지 않습니다.</p></div><nav><a href="#formats">형식 안내</a><a href="#style">스타일 안내</a><a href="#dealers">딜러 안내</a><a href="#account">개인정보</a></nav></footer>

      <div className="sticky-bar"><div className="sticky-summary"><strong>{totalDeliverables}개 형식 · {stories ? "스토리 포함" : "스토리 제외"}</strong><span>브라우저에서 제작 · 즉시 다운로드</span></div><button type="button" className="primary-button" onClick={() => setSummaryOpen(true)}>주문 내용 확인</button></div>

      {error && <div className="toast-error" role="alert"><span>{error}</span><button type="button" onClick={() => setError("")} aria-label="오류 알림 닫기">×</button></div>}

      {summaryOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget && !rendering) setSummaryOpen(false); }}><section className="summary-modal" role="dialog" aria-modal="true" aria-labelledby="summary-title"><button type="button" className="modal-close" onClick={() => !rendering && setSummaryOpen(false)} aria-label="닫기">×</button><p className="eyebrow">마지막 확인</p><h2 id="summary-title">영상 제작 내용을 확인해 주세요</h2><p className="summary-description">선택한 사진과 정보는 현재 브라우저 안에서 처리됩니다. 제작이 끝나면 WebM 영상 파일을 저장할 수 있습니다.</p><div className="summary-list"><span>차량</span><strong>{title}</strong><span>사진</span><strong>{files.length}장</strong><span>영상 형식</span><strong>{outputFormats.map((item) => `${item.name} ${item.ratio}`).join(" · ") || "선택한 형식 없음"}</strong><span>글꼴·음악</span><strong>{font} · {musicOptions.find(([id]) => id === music)?.[1]}</strong><span>판매 가격</span><strong>{formatMoney(data.price)}</strong></div>{rendering ? <div className="render-progress"><div><span>숏폼 영상 {Math.min(outputFormats.length, Math.floor(progress / 100 * outputFormats.length) + 1)} / {outputFormats.length} 제작 중</span><strong>{progress}%</strong></div><div className="progress-track"><i style={{ width: `${progress}%` }} /></div></div> : videoResults.length ? <div className="generated-result"><p>요청한 {videoResults.length}개 형식의 영상이 준비되었습니다.</p>{videoResults.map((item, index) => <div className="result-item" key={item.format.id}><video ref={index === 0 ? videoRef : undefined} src={item.url} controls playsInline /><div className="result-download-row"><strong>{item.format.name} · {item.format.ratio}</strong><a className="primary-button download-button" href={item.url} download={`${title.replace(/\s+/g, "-")}-${item.format.id}.webm`}>다운로드</a></div></div>)}<p>영상 파일은 WebM 형식이며 선택한 사진과 차량 정보로 만들어졌습니다.</p><div className="modal-actions"><button type="button" className="quiet-button" onClick={() => { setVideoResults([]); setSummaryOpen(false); }}>다시 편집하기</button><button type="button" className="primary-button" onClick={() => { setVideoResults([]); generateVideo(); }}>다시 제작</button></div></div> : <div className="modal-actions"><button type="button" className="quiet-button" onClick={() => setSummaryOpen(false)}>수정하기</button><button type="button" className="primary-button" onClick={generateVideo}>영상 제작하기</button></div>}</section></div>}
    </div>
  );
}
