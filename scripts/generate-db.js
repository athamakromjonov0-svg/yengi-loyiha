// db.json generatsiya skripti - 300+ mahsulot va 20+ kategoriya
import { writeFileSync } from 'fs';

// --- 20+ KATEGORIYA ---
const categories = [
  { id: "1", name: "MacBook", slug: "macbook" },
  { id: "2", name: "Notebook", slug: "notebook" },
  { id: "3", name: "Kompyuterlar", slug: "kompyuterlar" },
  { id: "4", name: "Kompyuter jihozlari", slug: "kompyuter-jihozlari" },
  { id: "5", name: "Monitorlar", slug: "monitorlar" },
  { id: "6", name: "Klaviaturalar", slug: "klaviaturalar" },
  { id: "7", name: "Sichqonchalar", slug: "sichqonchalar" },
  { id: "8", name: "Naushniklar", slug: "naushniklar" },
  { id: "9", name: "Kolonkalar", slug: "kolonkalar" },
  { id: "10", name: "Web-kameralar", slug: "web-kameralar" },
  { id: "11", name: "Mikrofonlar", slug: "mikrofonlar" },
  { id: "12", name: "SSD disklar", slug: "ssd-disklar" },
  { id: "13", name: "RAM xotira", slug: "ram-xotira" },
  { id: "14", name: "Videokartalar", slug: "videokartalar" },
  { id: "15", name: "Protsessorlar", slug: "protsessorlar" },
  { id: "16", name: "Quvvat bloklari", slug: "quvvat-bloklari" },
  { id: "17", name: "Korpuslar", slug: "korpuslar" },
  { id: "18", name: "Sovutish tizimlari", slug: "sovutish-tizimlari" },
  { id: "19", name: "Routerlar", slug: "routerlar" },
  { id: "20", name: "Printerlar", slug: "printerlar" },
  { id: "21", name: "Planshetlar", slug: "planshetlar" },
  { id: "22", name: "Smartfonlar", slug: "smartfonlar" },
  { id: "23", name: "Aksessuarlar", slug: "aksessuarlar" },
  { id: "24", name: "O'yin konsollari", slug: "oyin-konsollari" },
];

// --- RASMLAR (Unsplash) ---
const images = {
  laptop: [
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1496181130204-7552cc154d83?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80",
  ],
  desktop: [
    "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80",
  ],
  keyboard: [
    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&auto=format&fit=crop&q=80",
  ],
  mouse: [
    "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
  ],
  headphone: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
  ],
  speaker: [
    "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=600&auto=format&fit=crop&q=80",
  ],
  camera: [
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80",
  ],
  mic: [
    "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1589901860904-7e6f8a30b7a8?w=600&auto=format&fit=crop&q=80",
  ],
  storage: [
    "https://images.unsplash.com/photo-1562976540-1502c2145186?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80",
  ],
  gpu: [
    "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&auto=format&fit=crop&q=80",
  ],
  cpu: [
    "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1555617981-dac3880eac9e?w=600&auto=format&fit=crop&q=80",
  ],
  psu: [
    "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&auto=format&fit=crop&q=80",
  ],
  case: [
    "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&auto=format&fit=crop&q=80",
  ],
  cooling: [
    "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
  ],
  router: [
    "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&auto=format&fit=crop&q=80",
  ],
  printer: [
    "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&auto=format&fit=crop&q=80",
  ],
  tablet: [
    "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&auto=format&fit=crop&q=80",
  ],
  phone: [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80",
  ],
  accessory: [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=600&auto=format&fit=crop&q=80",
  ],
  console: [
    "https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&auto=format&fit=crop&q=80",
  ],
  monitor: [
    "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&auto=format&fit=crop&q=80",
  ],
};

// --- MAHSULOT TEMPLATLARI ---
const productTemplates = [
  // MacBook (15 ta)
  { cat: "MacBook", img: "laptop", count: 15, names: ["MacBook Pro 16\" M3 Max", "MacBook Air 15\" M3", "MacBook Pro 14\" M3 Pro", "MacBook Air 13\" M2", "MacBook Pro 16\" M2 Max", "MacBook Air 13\" M3 16GB", "MacBook Pro 14\" M3 Max Elite", "MacBook Pro 16\" M3 Pro Space Black", "MacBook Air 15\" M2 Balance", "MacBook Pro 14\" M1 Max Architect", "MacBook Pro 13\" M2 Touch Bar", "MacBook Air 13\" M1 Classic", "MacBook Pro 16\" M1 Pro Value", "MacBook Air 15\" M3 Maxed Out", "MacBook Pro 14\" M3 Base"], specs: ["M3 Chip", "16GB RAM", "512GB SSD", "Liquid Retina"], minPrice: 999, maxPrice: 4599 },
  // Notebook (20 ta)
  { cat: "Notebook", img: "laptop", count: 20, names: ["ROG Strix SCAR 18 Gaming", "Lenovo ThinkPad X1 Carbon Gen 12", "HP Spectre x360 Convertible", "ASUS Zenbook Pro 14 Duo OLED", "MSI Raider GE78 HX V14", "Acer Predator Helios 16", "Lenovo Legion Pro 7i Gen 9", "GIGABYTE AORUS 17X AX", "Razer Blade 16 Advanced 2024", "MSI Aegis RS 14th", "ASUS ROG Zephyrus G16 OLED", "Sager Clevo Extreme", "Samsung Galaxy Book4 Ultra", "MSI Stealth 14 Studio", "LG Gram Pro 17 Superlight", "ASUS Vivobook Pro 16X OLED", "Lenovo Legion Slim 5 Gen 9", "ASUS TUF Gaming A15", "HP Omen Transcend 16", "Dell XPS 16 2024"], specs: ["Core i9", "RTX 4080", "32GB RAM", "1TB SSD"], minPrice: 899, maxPrice: 4399 },
  // Kompyuterlar (20 ta)
  { cat: "Kompyuterlar", img: "desktop", count: 20, names: ["Vortex Quantum Station PC", "Corsair One i500 Studio", "Alienware Aurora R16 Gaming", "ASUS ROG Horizon Compact", "HP Omen 45L Liquid PC", "Apple Mac Studio M3 Ultra", "Vortex Vector AMD Alpha", "Apple Mac Mini M3 Hub", "MSI Aegis RS 14th System", "CyberPowerPC Gamer Supreme", "ASUS ROG Strix GA35", "Apple Mac Pro Intel Rack", "Skytech Prism II Custom", "Thermaltake Tower 500", "Velocity Custom Workstation", "Intel NUC 13 Extreme", "Corsair Vengeance i7400", "iBUYPOWER Y40 Gaming", "Origin PC Chronos V3", "Falcon Northwest Talon"], specs: ["Ryzen 9", "RTX 4090", "64GB DDR5", "Liquid Cooled"], minPrice: 799, maxPrice: 8999 },
  // Kompyuter jihozlari (20 ta)
  { cat: "Kompyuter jihozlari", img: "accessory", count: 20, names: ["Razer BlackWidow V4 Pro", "Logitech MX Master 3S", "Elgato Stream Deck XL", "NVIDIA GeForce RTX 4090 FE", "Corsair Dominator Titanium 64GB", "WD Black SN854X NVMe 4TB", "ASUS ROG Thor 1200W Platinum", "Corsair iCUE LINK H150i", "Lian Li O11 Dynamic EVO", "Razer Leviathan V2 Soundbar", "Elgato Wave:3 Microphone", "ASUS ROG Azoth Wireless", "Noctua NH-D15 Chromax", "Razer Basilisk V3 Pro", "Logitech G Pro X Superlight 2", "Corsair K100 RGB Optical", "SteelSeries Apex Pro TKL", "HyperX Cloud III Wireless", "Samsung 990 Pro 2TB", "G.Skill Trident Z5 RGB"], specs: ["RGB", "Wireless", "Premium", "Gaming"], minPrice: 49, maxPrice: 1599 },
  // Monitorlar (15 ta)
  { cat: "Monitorlar", img: "monitor", count: 15, names: ["Samsung Odyssey Ark 55\"", "ASUS ROG Swift OLED PG42UQ", "LG UltraGear 45\" OLED", "Dell UltraSharp 32\" 4K", "Samsung Odyssey G9 49\"", "LG UltraFine 27\" 5K", "ASUS ProArt PA32UCX", "BenQ PD3220U Designer", "Acer Predator X27U", "MSI MPG 321URX QD-OLED", "Gigabyte M32U 4K", "ViewSonic XG321UG", "Samsung ViewFinity S9", "LG DualUp 28MQ780", "Dell Alienware AW3423DW"], specs: ["4K", "OLED", "240Hz", "HDR"], minPrice: 299, maxPrice: 2499 },
  // Klaviaturalar (12 ta)
  { cat: "Klaviaturalar", img: "keyboard", count: 12, names: ["Corsair K100 RGB Optical", "SteelSeries Apex Pro TKL", "Razer Huntsman V3 Pro", "Logitech G915 X Lightspeed", "Keychron Q1 Pro", "Ducky One 3 Mini", "Wooting 60HE", "Epomaker TH80 Pro", "Akko 5075B Plus", "Royal Kludge RK61", "Anne Pro 2", "Varmilo VA108M"], specs: ["Mechanical", "RGB", "Hot-Swap", "Wireless"], minPrice: 49, maxPrice: 299 },
  // Sichqonchalar (12 ta)
  { cat: "Sichqonchalar", img: "mouse", count: 12, names: ["Logitech G Pro X Superlight 2", "Razer Viper V3 Pro", "Logitech MX Master 3S", "Razer Basilisk V3 Pro", "SteelSeries Aerox 5", "Glorious Model O 2", "Zowie EC2-CW", "Pulsar X2V2", "VGN Dragonfly F1", "Logitech G502 X Plus", "Razer DeathAdder V3 Pro", "Corsair M65 RGB Ultra"], specs: ["Wireless", "32K DPI", "Ergonomic", "RGB"], minPrice: 29, maxPrice: 199 },
  // Naushniklar (12 ta)
  { cat: "Naushniklar", img: "headphone", count: 12, names: ["Sony WH-1000XM5", "Bose QuietComfort Ultra", "Apple AirPods Max", "Sennheiser Momentum 4", "HyperX Cloud III", "SteelSeries Arctis Nova Pro", "Razer BlackShark V2 Pro", "Logitech G Astro A50 X", "JBL Quantum One", "Corsair Virtuoso RGB XT", "Audio-Technica ATH-M50x", "Beyerdynamic DT 770 Pro"], specs: ["Wireless", "ANC", "7.1 Surround", "Studio"], minPrice: 79, maxPrice: 549 },
  // Kolonkalar (10 ta)
  { cat: "Kolonkalar", img: "speaker", count: 10, names: ["Razer Leviathan V2", "Logitech Z906 5.1", "Creative Pebble Pro", "Edifier S360DB", "JBL Charge 5", "Bose SoundLink Revolve+", "Sony SRS-XG500", "Marshall Stanmore III", "Klipsch ProMedia 2.1", "Harman Kardon SoundSticks 4"], specs: ["Bluetooth", "5.1 Surround", "Bass", "RGB"], minPrice: 39, maxPrice: 499 },
  // Web-kameralar (8 ta)
  { cat: "Web-kameralar", img: "camera", count: 8, names: ["Logitech Brio 4K", "Razer Kiyo Pro Ultra", "Elgato Facecam Pro", "Logitech StreamCam", "Insta360 Link", "AverMedia PW513", "Microsoft LifeCam Studio", "Creative Live Cam Sync 4K"], specs: ["4K", "60FPS", "Auto-Focus", "USB-C"], minPrice: 49, maxPrice: 299 },
  // Mikrofonlar (8 ta)
  { cat: "Mikrofonlar", img: "mic", count: 8, names: ["Elgato Wave:3", "Shure MV7", "Blue Yeti X", "Rode NT-USB+", "HyperX QuadCast S", "Samson Q2U", "Audio-Technica AT2020", "Fifine AM8"], specs: ["USB", "Condenser", "Studio", "RGB"], minPrice: 49, maxPrice: 249 },
  // SSD disklar (10 ta)
  { cat: "SSD disklar", img: "storage", count: 10, names: ["Samsung 990 Pro 2TB", "WD Black SN850X 4TB", "Crucial T700 2TB", "Seagate FireCuda 530", "Kingston KC3000", "Sabrent Rocket 4 Plus", "Corsair MP600 Pro XT", "ADATA Legend 970", "SK Hynix Platinum P41", "Lexar NM790"], specs: ["NVMe", "PCIe 4.0", "7000MB/s", "Heatsink"], minPrice: 79, maxPrice: 399 },
  // RAM xotira (8 ta)
  { cat: "RAM xotira", img: "storage", count: 8, names: ["Corsair Dominator Titanium 64GB", "G.Skill Trident Z5 RGB 32GB", "Kingston Fury Beast 32GB", "Crucial Pro 64GB", "TeamGroup T-Force Delta 32GB", "Patriot Viper Venom 32GB", "ADATA XPG Lancer 32GB", "Corsair Vengeance 16GB"], specs: ["DDR5", "6000MHz", "RGB", "CL30"], minPrice: 49, maxPrice: 349 },
  // Videokartalar (10 ta)
  { cat: "Videokartalar", img: "gpu", count: 10, names: ["NVIDIA RTX 4090 Founders", "ASUS ROG Strix RTX 4080 Super", "MSI Gaming X RTX 4070 Ti", "Gigabyte Aorus RTX 4070", "Sapphire Nitro+ RX 7900 XTX", "PowerColor Red Devil RX 7800 XT", "EVGA RTX 3080 Ti", "Zotac Gaming RTX 4060 Ti", "PNY RTX 4070 Super", "XFX Speedster RX 7700 XT"], specs: ["24GB GDDR6X", "Ray Tracing", "DLSS 3", "Ada Lovelace"], minPrice: 299, maxPrice: 1999 },
  // Protsessorlar (8 ta)
  { cat: "Protsessorlar", img: "cpu", count: 8, names: ["Intel Core i9-14900K", "AMD Ryzen 9 7950X3D", "Intel Core i7-14700K", "AMD Ryzen 7 7800X3D", "Intel Core i5-14600K", "AMD Ryzen 5 7600X", "Intel Core i9-13900K", "AMD Ryzen 9 5950X"], specs: ["24 Cores", "5.8GHz", "LGA1700", "AM5"], minPrice: 199, maxPrice: 699 },
  // Quvvat bloklari (8 ta)
  { cat: "Quvvat bloklari", img: "psu", count: 8, names: ["ASUS ROG Thor 1200W Platinum", "Corsair AX1600i", "Seasonic Prime TX-1000", "EVGA SuperNOVA 1000W", "be quiet! Dark Power 13", "Cooler Master MWE 850W", "Thermaltake Toughpower 750W", "FSP Hydro G Pro 1000W"], specs: ["80+ Platinum", "1200W", "ATX 3.0", "Modular"], minPrice: 89, maxPrice: 399 },
  // Korpuslar (8 ta)
  { cat: "Korpuslar", img: "case", count: 8, names: ["Lian Li O11 Dynamic EVO", "NZXT H9 Flow", "Corsair 5000D Airflow", "Fractal Design North", "Phanteks Eclipse G500A", "Cooler Master HAF 700", "Thermaltake Tower 900", "HYTE Y60"], specs: ["ATX", "Tempered Glass", "RGB", "Watercooling"], minPrice: 79, maxPrice: 299 },
  // Sovutish tizimlari (8 ta)
  { cat: "Sovutish tizimlari", img: "cooling", count: 8, names: ["Corsair iCUE H150i Elite", "NZXT Kraken Elite 360", "Noctua NH-D15 Chromax", "Arctic Liquid Freezer III", "DeepCool LS720", "Lian Li Galahad II", "be quiet! Silent Loop 2", "Cooler Master MasterLiquid 360"], specs: ["360mm", "AIO", "RGB", "Low Noise"], minPrice: 69, maxPrice: 279 },
  // Routerlar (8 ta)
  { cat: "Routerlar", img: "router", count: 8, names: ["ASUS ROG Rapture GT-AX11000", "TP-Link Archer AXE300", "Netgear Nighthawk RAXE500", "Ubiquiti UniFi Dream Machine", "Linksys Velop MX4200", "ASUS RT-AX86U Pro", "TP-Link Deco XE75", "Google Nest WiFi Pro"], specs: ["WiFi 6E", "Tri-Band", "Gaming", "Mesh"], minPrice: 99, maxPrice: 499 },
  // Printerlar (6 ta)
  { cat: "Printerlar", img: "printer", count: 6, names: ["HP LaserJet Pro M404dn", "Epson EcoTank ET-2850", "Canon PIXMA G6020", "Brother HL-L3290CDW", "Xerox VersaLink C405", "Samsung Xpress M2020W"], specs: ["Laser", "Wireless", "Duplex", "Color"], minPrice: 99, maxPrice: 499 },
  // Planshetlar (8 ta)
  { cat: "Planshetlar", img: "tablet", count: 8, names: ["Apple iPad Pro 12.9\" M4", "Samsung Galaxy Tab S9 Ultra", "Apple iPad Air 11\" M2", "Microsoft Surface Pro 10", "Lenovo Tab P12", "Xiaomi Pad 6 Pro", "Google Pixel Tablet", "Amazon Fire Max 11"], specs: ["M4 Chip", "12.9 Inch", "120Hz", "5G"], minPrice: 199, maxPrice: 1299 },
  // Smartfonlar (12 ta)
  { cat: "Smartfonlar", img: "phone", count: 12, names: ["iPhone 15 Pro Max", "Samsung Galaxy S24 Ultra", "Google Pixel 9 Pro", "OnePlus 12", "Xiaomi 14 Ultra", "Sony Xperia 1 VI", "ASUS ROG Phone 8 Pro", "Nothing Phone 2", "Motorola Edge 50 Ultra", "Honor Magic6 Pro", "Oppo Find X7 Ultra", "Vivo X100 Pro"], specs: ["5G", "200MP Camera", "AMOLED", "120Hz"], minPrice: 299, maxPrice: 1599 },
  // Aksessuarlar (12 ta)
  { cat: "Aksessuarlar", img: "accessory", count: 12, names: ["Apple Magic Keyboard", "Logitech Crayon", "Anker 737 Power Bank", "Belkin Thunderbolt 4 Dock", "Satechi USB-C Hub", "UGREEN 100W Charger", "Spigen Ultra Hybrid Case", "Nomad Base One Max", "Twelve South BookArc", "Mophie 3-in-1 Stand", "Casetify Impact Case", "OtterBox Defender"], specs: ["USB-C", "Wireless", "Premium", "Compatible"], minPrice: 19, maxPrice: 299 },
  // O'yin konsollari (6 ta)
  { cat: "O'yin konsollari", img: "console", count: 6, names: ["PlayStation 5 Pro", "Xbox Series X", "Nintendo Switch OLED", "Steam Deck OLED", "PlayStation Portal", "Xbox Series S"], specs: ["4K", "120FPS", "SSD", "Cloud Gaming"], minPrice: 299, maxPrice: 699 },
];

// --- GENERATOR ---
const products = [];
let id = 1;

const brands = ["Vortex", "Quantum", "Nova", "Hyper", "Cyber", "Titan", "Apex", "Nexus", "Prime", "Ultra", "Fusion", "Pulse", "Vertex", "Zenith", "Orbit", "Eclipse", "Phantom", "Raptor", "Storm", "Blaze"];

const descriptions = [
  "Premium sifatli mahsulot, eng so'nggi texnologiyalar bilan jihozlangan. Professional foydalanuvchilar uchun ideal tanlov.",
  "Yuqori unumdorlik va ishonchlilik. Zamonaviy dizayn va ilg'or funksiyalar bilan to'liq paket.",
  "Kiber-futuristik dizayn, maksimal samaradorlik. Har bir detalda sifat va innovatsiya.",
  "Professional darajadagi ishlash ko'rsatkichlari. Uzoq muddatli foydalanish uchun mo'ljallangan.",
  "Eng so'nggi texnologiyalar bilan jihozlangan, yuqori sifatli komponentlar. Gaming va ish uchun mukammal.",
  "Innovatsion yechimlar, premium materiallar. Har qanday vazifani oson bajaradi.",
  "Yuqori tezlik, barqaror ishlash. Zamonaviy interfeys va qulay boshqaruv.",
  "Kuchli apparat ta'minoti, ajoyib dizayn. Professional va shaxsiy foydalanish uchun.",
  "Eng yaxshi narx-sifat nisbati. Ishonchli brend, kafolatli mahsulot.",
  "Maksimal unumdorlik uchun optimallashtirilgan. Har bir foydalanuvchi uchun mos.",
];

const specsPool = {
  "MacBook": ["M3 Max", "48GB RAM", "1TB SSD", "Liquid Retina XDR", "Space Black", "18-hour Battery"],
  "Notebook": ["Core i9", "RTX 4080", "32GB RAM", "1TB SSD", "240Hz Display", "WiFi 6E"],
  "Kompyuterlar": ["Ryzen 9", "RTX 4090", "64GB DDR5", "Liquid Cooled", "2TB NVMe", "RGB Lighting"],
  "Kompyuter jihozlari": ["RGB", "Wireless", "Premium", "Gaming", "USB-C", "Ergonomic"],
  "Monitorlar": ["4K", "OLED", "240Hz", "HDR1000", "1ms Response", "G-Sync"],
  "Klaviaturalar": ["Mechanical", "RGB", "Hot-Swap", "Wireless", "PBT Keycaps", "Gasket Mount"],
  "Sichqonchalar": ["Wireless", "32K DPI", "Ergonomic", "RGB", "Lightweight", "Optical"],
  "Naushniklar": ["Wireless", "ANC", "7.1 Surround", "Studio", "40mm Drivers", "Bluetooth 5.3"],
  "Kolonkalar": ["Bluetooth", "5.1 Surround", "Bass", "RGB", "USB-C", "Subwoofer"],
  "Web-kameralar": ["4K", "60FPS", "Auto-Focus", "USB-C", "Privacy Shutter", "Dual Mic"],
  "Mikrofonlar": ["USB", "Condenser", "Studio", "RGB", "Cardioid", "Pop Filter"],
  "SSD disklar": ["NVMe", "PCIe 4.0", "7000MB/s", "Heatsink", "1TB-4TB", "TLC NAND"],
  "RAM xotira": ["DDR5", "6000MHz", "RGB", "CL30", "32GB-64GB", "XMP 3.0"],
  "Videokartalar": ["24GB GDDR6X", "Ray Tracing", "DLSS 3", "Ada Lovelace", "3-Fan", "OC Edition"],
  "Protsessorlar": ["24 Cores", "5.8GHz", "LGA1700", "AM5", "Unlocked", "iGPU"],
  "Quvvat bloklari": ["80+ Platinum", "1200W", "ATX 3.0", "Modular", "Zero RPM", "10-Year Warranty"],
  "Korpuslar": ["ATX", "Tempered Glass", "RGB", "Watercooling", "Dual Chamber", "Airflow"],
  "Sovutish tizimlari": ["360mm", "AIO", "RGB", "Low Noise", "Copper Base", "PWM Fans"],
  "Routerlar": ["WiFi 6E", "Tri-Band", "Gaming", "Mesh", "2.5G Port", "VPN Support"],
  "Printerlar": ["Laser", "Wireless", "Duplex", "Color", "Auto-Feed", "Mobile Print"],
  "Planshetlar": ["M4 Chip", "12.9 Inch", "120Hz", "5G", "Face ID", "Apple Pencil"],
  "Smartfonlar": ["5G", "200MP Camera", "AMOLED", "120Hz", "5000mAh", "IP68"],
  "Aksessuarlar": ["USB-C", "Wireless", "Premium", "Compatible", "Portable", "Durable"],
  "O'yin konsollari": ["4K", "120FPS", "SSD", "Cloud Gaming", "Ray Tracing", "DualSense"],
};

for (const template of productTemplates) {
  const catSpecs = specsPool[template.cat] || specsPool["Kompyuter jihozlari"];
  for (let i = 0; i < template.count; i++) {
    const nameIndex = i % template.names.length;
    const baseName = template.names[nameIndex];
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const name = i >= template.names.length 
      ? `${brand} ${baseName} ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 9) + 1}`
      : baseName;
    
    const price = Math.round((template.minPrice + Math.random() * (template.maxPrice - template.minPrice)) / 10) * 10;
    const discount = Math.random() < 0.4 ? [0, 5, 10, 15, 20, 25, 30][Math.floor(Math.random() * 7)] : 0;
    const stock = Math.floor(Math.random() * 50) + 1;
    const rating = (4 + Math.random() * 1).toFixed(1);
    const reviewsCount = Math.floor(Math.random() * 500) + 5;
    const isNew = Math.random() < 0.3;
    
    const imgPool = images[template.img] || images.accessory;
    const image = imgPool[Math.floor(Math.random() * imgPool.length)];
    
    const specs = [...catSpecs].sort(() => Math.random() - 0.5).slice(0, 4);
    
    products.push({
      id: String(id++),
      title: name,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      price,
      category: template.cat,
      image,
      discount,
      stock,
      isNew,
      rating: Number(rating),
      reviewsCount,
      specs,
    });
  }
}

// --- QO'SHIMCHA MAHSULOTLAR (300+ ga yetkazish) ---
const extraCount = 60;
for (let i = 0; i < extraCount; i++) {
  const template = productTemplates[Math.floor(Math.random() * productTemplates.length)];
  const catSpecs = specsPool[template.cat] || specsPool["Kompyuter jihozlari"];
  const brand = brands[Math.floor(Math.random() * brands.length)];
  const baseName = template.names[Math.floor(Math.random() * template.names.length)];
  const name = `${brand} ${baseName} ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 9) + 1}`;
  
  const price = Math.round((template.minPrice + Math.random() * (template.maxPrice - template.minPrice)) / 10) * 10;
  const discount = Math.random() < 0.4 ? [0, 5, 10, 15, 20, 25, 30][Math.floor(Math.random() * 7)] : 0;
  const stock = Math.floor(Math.random() * 50) + 1;
  const rating = (4 + Math.random() * 1).toFixed(1);
  const reviewsCount = Math.floor(Math.random() * 500) + 5;
  const isNew = Math.random() < 0.3;
  
  const imgPool = images[template.img] || images.accessory;
  const image = imgPool[Math.floor(Math.random() * imgPool.length)];
  const specs = [...catSpecs].sort(() => Math.random() - 0.5).slice(0, 4);
  
  products.push({
    id: String(id++),
    title: name,
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    price,
    category: template.cat,
    image,
    discount,
    stock,
    isNew,
    rating: Number(rating),
    reviewsCount,
    specs,
  });
}

const db = { products, categories };
writeFileSync('db.json', JSON.stringify(db, null, 2), 'utf-8');
console.log(`✅ ${products.length} ta mahsulot va ${categories.length} ta kategoriya generatsiya qilindi!`);
