// data/destinations.js
// Single source of truth for all destinations

export const CATS = {
  waters:    { name: 'Peaceful Waters',  emoji: '🌊', color: '#5BC8FF', glow: '#0A2030' },
  forest:    { name: 'Ancient Forests',  emoji: '🌲', color: '#58E87A', glow: '#0A1A0A' },
  mountain:  { name: 'Mountain Heights', emoji: '⛰️',  color: '#A8B8FF', glow: '#141828' },
  desert:    { name: 'Desert Silence',   emoji: '🏜️',  color: '#FFB840', glow: '#201408' },
  garden:    { name: 'Garden & Bloom',   emoji: '🌸', color: '#FF85C0', glow: '#200810' },
  waterfall: { name: 'Wild Waterfalls',  emoji: '💧', color: '#60E8FF', glow: '#081820' },
  city:      { name: 'Living Cities',    emoji: '🌆', color: '#FFD060', glow: '#181408' },
  arctic:    { name: 'Arctic & Aurora',  emoji: '❄️',  color: '#B0D8FF', glow: '#060810' },
}

// Category default dimensional profiles [scale,complexity,humans,age,energy,tone]
export const CAT_PROFILES = {
  waters:    [3,2,1,4,2,4],
  forest:    [2,3,1,4,2,2],
  mountain:  [4,2,1,4,3,2],
  desert:    [4,1,1,5,1,4],
  garden:    [2,3,2,2,2,4],
  waterfall: [3,2,1,3,5,3],
  city:      [2,4,5,2,4,4],
  arctic:    [4,1,1,5,3,1],
}

// Individual destination overrides
export const DEST_PROFILES = {
  'Maldives Atoll':       [3,2,2,4,2,5],
  'Whitehaven Beach':     [3,1,1,4,2,5],
  'Amazon River':         [4,5,1,5,3,4],
  'Crater Lake':          [3,1,1,5,1,3],
  'Salar de Uyuni':       [5,1,1,5,1,3],
  'Lake Baikal':          [4,1,1,5,1,2],
  'Yakushima Cedar':      [2,3,1,5,1,2],
  'Hoh Rainforest':       [2,4,1,5,2,2],
  'Grand Canyon':         [5,1,2,5,2,4],
  'Everest Region':       [5,1,1,5,2,1],
  'Trolltunga':           [5,1,1,4,3,2],
  'Sahara Dunes':         [5,1,1,5,1,5],
  'White Sands':          [4,1,1,4,1,4],
  'Cappadocia':           [4,2,2,5,3,4],
  'Aurora Borealis':      [5,2,1,5,5,1],
  'Diamond Beach':        [4,1,1,5,4,1],
  'Iguazu Falls':         [4,3,2,3,5,4],
  'Victoria Falls':       [4,2,1,3,5,3],
  'Angel Falls':          [5,2,1,4,5,4],
  'Djemaa el-Fna':        [2,5,5,3,5,5],
  'Varanasi Ghats':       [2,5,5,5,4,5],
  'Shinjuku at Night':    [2,5,5,2,5,4],
  'Petra':                [4,2,2,5,2,4],
  'Ryoanji':              [1,2,2,4,1,3],
}

function d(cat, name, country, lat, lng, sound, desc, q1, q2) {
  return { cat, name, country, lat, lng, sound, desc, q1, q2 }
}

export const DESTINATIONS = [
  // WATERS
  d('waters','Maldives Atoll','Maldives',4.2,73.5,'ocean','Turquoise lagoons to infinity. Every wave takes something heavy from you.','maldives turquoise lagoon aerial drone cinematic','tropical beach paradise aerial timelapse'),
  d('waters','Lake Bled','Slovenia',46.4,14.1,'forest','A mirror lake in mountains. Still water, still mind.','lake bled reflection mountain aerial drone cinematic','alpine lake reflection timelapse scenic'),
  d('waters','Amalfi Coast','Italy',40.6,14.6,'ocean','Clifftop villages in a glittering sea. Life at the pace of sunlight.','amalfi coast aerial drone cliffs sea cinematic','mediterranean coast aerial timelapse'),
  d('waters','Santorini','Greece',36.4,25.5,'ocean','White walls blazing in afternoon sun. The Aegean like a dream remembered.','santorini oia aerial drone sunset cinematic','greek island aerial sunset timelapse'),
  d('waters','Bora Bora','French Polynesia',-16.5,-151.7,'ocean','The most beautiful lagoon on earth.','bora bora aerial drone lagoon cinematic','tropical lagoon aerial timelapse paradise'),
  d('waters','Lake Como','Italy',46.0,9.3,'forest','Mountains meeting water, villas in gardens. Timeless and still.','lake como aerial drone italy cinematic','alpine lake aerial timelapse scenic'),
  d('waters','Whitehaven Beach','Australia',-20.3,149.1,'ocean','Silica sand so fine it never gets hot. White ribbon between two blues.','whitehaven beach aerial drone cinematic','pristine beach aerial timelapse white sand'),
  d('waters','Halong Bay','Vietnam',20.9,107.2,'ocean','Limestone towers from emerald water. Ancient and unhurried.','halong bay aerial drone limestone cinematic','karst islands aerial timelapse mist'),
  d('waters','Raja Ampat','Indonesia',-0.2,130.5,'ocean','The most biodiverse waters on earth.','raja ampat aerial drone coral reef cinematic','tropical reef aerial timelapse island'),
  d('waters','Phi Phi Islands','Thailand',7.7,98.8,'ocean','Limestone cliffs plunging into emerald. Paradise has an address here.','phi phi island aerial drone cinematic','limestone cliff beach aerial timelapse'),
  d('waters','Palawan','Philippines',9.8,118.7,'ocean','Underground rivers, hidden lagoons, extraordinary coast.','palawan aerial drone lagoon cinematic','hidden lagoon aerial timelapse philippines'),
  d('waters','Cinque Terre','Italy',44.1,9.7,'ocean','Five pastel villages clinging to Ligurian cliffs.','cinque terre aerial drone sea cinematic','colorful village cliff aerial timelapse'),
  d('waters','Dubrovnik','Croatia',42.7,18.1,'ocean','The pearl of the Adriatic. Medieval walls at a crystal sea.','dubrovnik aerial drone old town cinematic','adriatic coast aerial timelapse scenic'),
  d('waters','Lake Tahoe','USA',39.1,-120.0,'forest','The clearest lake in North America.','lake tahoe aerial drone mountain cinematic','mountain lake aerial timelapse scenic'),
  d('waters','Zanzibar','Tanzania',-6.2,39.2,'ocean','Spice-scented breezes and luminous Indian Ocean turquoise.','zanzibar beach aerial drone cinematic','indian ocean beach aerial timelapse'),
  d('waters','Seychelles','Seychelles',-4.6,55.5,'ocean','Granite boulders, impossibly clear water.','seychelles aerial drone beach granite cinematic','tropical beach aerial timelapse granite'),
  d('waters','Nusa Penida','Indonesia',-8.7,115.5,'ocean','Dramatic cliffs, an ocean so blue it looks painted.','nusa penida aerial drone cliff cinematic','dramatic cliff aerial timelapse ocean'),
  d('waters','Azores','Portugal',37.7,-25.7,'ocean','Mid-Atlantic volcanic craters turned turquoise lakes.','azores aerial drone volcanic lake cinematic','volcanic island aerial timelapse scenic'),
  d('waters','Lake Atitlan','Guatemala',14.7,-91.2,'forest','Three volcanoes, extraordinary blue water, ancient villages.','lake atitlan aerial drone volcano cinematic','volcanic lake aerial timelapse mountains'),
  d('waters','Bay of Kotor','Montenegro',42.4,18.8,'ocean','A winding fjord-like bay with medieval walls.','kotor bay aerial drone cinematic','adriatic bay aerial timelapse mountains'),
  d('waters','Balos Lagoon','Crete, Greece',35.6,23.6,'ocean','Pink sand lagoon where three seas meet.','crete balos lagoon aerial drone cinematic','lagoon aerial timelapse pink sand scenic'),
  d('waters','Turks and Caicos','Caribbean',21.7,-71.7,'ocean','The most crystalline water in the Western Hemisphere.','turks caicos aerial drone beach cinematic','caribbean beach aerial timelapse crystal'),
  d('waters','Krabi','Thailand',8.1,98.9,'ocean','Cathedral limestone towers from shallow emerald water.','krabi thailand aerial drone limestone cinematic','limestone sea aerial timelapse thailand'),
  d('waters','Lake Baikal','Russia',53.5,108.2,'forest','The world deepest lake. Blue ice formations in winter.','lake baikal aerial drone winter cinematic','deepest lake aerial timelapse ice'),
  d('waters','Amazon River','Brazil',-3.5,-60.0,'forest','The great river winding through the lung of the earth.','amazon river aerial drone rainforest cinematic','tropical river aerial timelapse vast'),
  d('waters','Plitvice Lakes','Croatia',44.9,15.6,'forest','Sixteen terraced lakes of impossible turquoise.','plitvice lakes aerial drone turquoise cinematic','cascade lake aerial timelapse scenic'),
  d('waters','Lake Louise','Canada',51.4,-116.2,'forest','Iconic glacial lake, turquoise as paint, beneath snow-capped peaks.','lake louise aerial drone glacier cinematic','glacial lake aerial timelapse canada'),
  d('waters','Great Barrier Reef','Australia',-18.3,147.7,'ocean','The world largest coral system.','great barrier reef aerial drone cinematic','reef aerial timelapse australia scenic'),
  d('waters','Li River','China',25.0,110.4,'forest','Karst mountains rising from river mist.','li river guilin aerial drone cinematic','karst river aerial timelapse mist'),
  d('waters','Crater Lake','USA',42.9,-122.1,'forest','The deepest lake in the USA, inside a volcano, impossibly blue.','crater lake aerial drone volcano cinematic','volcano lake aerial timelapse scenic'),
  d('waters','Pamukkale','Turkey',37.9,29.1,'ocean','Cotton castle — white travertine terraces filled with thermal blue water.','pamukkale aerial drone travertine cinematic','white terraces aerial timelapse turkey'),
  d('waters','Dead Sea','Jordan',31.5,35.5,'wind','The lowest point on earth. You float without trying.','dead sea aerial drone salt cinematic','salt lake aerial timelapse floating'),
  d('waters','Lake Tekapo','New Zealand',-44.0,170.5,'forest','The most star-filled sky above a turquoise glacial lake.','lake tekapo aerial drone new zealand cinematic','new zealand lake aerial timelapse stars'),
  d('waters','Phang Nga Bay','Thailand',8.3,98.5,'ocean','Vertical limestone islands rising from jade water.','phang nga bay aerial drone cinematic','limestone bay aerial timelapse thailand'),
  d('waters','Marlborough Sounds','New Zealand',-41.1,174.0,'ocean','A drowned river valley system of sheltered waterways.','marlborough sounds aerial drone cinematic','sounds aerial timelapse new zealand'),
  d('waters','Loch Ness','Scotland',57.3,-4.4,'forest','Dark peat-stained water in a dramatic Highland valley.','loch ness aerial drone scotland cinematic','scotland loch aerial timelapse mist'),
  d('waters','Cenote Ik Kil','Mexico',20.6,-88.6,'ocean','A sacred Mayan cenote — circular opening to an underground world.','cenote ik kil aerial drone mexico cinematic','cenote aerial timelapse jungle'),
  d('waters','Verzasca River','Switzerland',46.2,8.8,'forest','Emerald river so clear you can see every stone from above.','verzasca river aerial drone cinematic','alpine river aerial timelapse clear'),
  d('waters','Bay of Fundy','Canada',45.3,-64.8,'ocean','The highest tidal range on earth — 16 metres twice daily.','bay of fundy aerial drone tide cinematic','tidal aerial timelapse canada'),

  // FORESTS
  d('forest','Arashiyama Bamboo','Kyoto, Japan',35.0,135.7,'forest','A cathedral of green. Bamboo sways, the world quiets.','bamboo forest kyoto aerial drone cinematic','bamboo grove aerial timelapse green light'),
  d('forest','Coastal Redwoods','California, USA',41.2,-124.0,'forest','Trees ancient when history began. Nothing feels urgent here.','redwood forest aerial drone giant cinematic','tall ancient forest aerial timelapse'),
  d('forest','Black Forest','Germany',47.9,8.2,'forest','Ancient pines and fairy-tale silence.','black forest aerial drone pine mist cinematic','pine forest aerial timelapse mist'),
  d('forest','Cloud Forest','Monteverde, Costa Rica',10.3,-84.8,'forest','Mist-wrapped trees, howling wildlife.','cloud forest aerial drone mist cinematic','tropical misty forest aerial timelapse'),
  d('forest','Hoh Rainforest','Washington, USA',47.9,-123.9,'forest','Moss on every surface, quiet everywhere.','hoh rainforest aerial drone moss cinematic','temperate rainforest aerial timelapse'),
  d('forest','Daintree Rainforest','Queensland, Australia',-16.2,145.4,'forest','180 million years old and still breathing.','daintree rainforest aerial drone ancient cinematic','tropical rainforest aerial timelapse'),
  d('forest','Amazon Rainforest','Brazil',-3.5,-60.0,'forest','The lungs of the earth. Older and more alive than anything.','amazon rainforest aerial drone vast cinematic','tropical rainforest aerial timelapse vast'),
  d('forest','Yakushima Cedar','Japan',30.3,130.5,'forest','Thousand-year-old cedars wrapped in moss.','yakushima cedar moss aerial drone cinematic','ancient cedar forest aerial timelapse'),
  d('forest','Bialowieza','Poland',52.7,23.9,'forest','The last primeval forest in Europe. Unchanged for ten thousand years.','primeval ancient forest aerial drone cinematic','ancient european forest aerial timelapse'),
  d('forest','Olympic Rainforest','Washington, USA',47.8,-123.6,'forest','Multiple ecosystems in one park. Moss cathedral.','olympic park rainforest aerial drone cinematic','temperate rainforest aerial timelapse moss'),
  d('forest','Bohemian Switzerland','Czech Republic',50.9,14.3,'forest','Sandstone pillars rising through pine forest.','bohemian sandstone aerial drone forest cinematic','rock pillars aerial timelapse forest mist'),
  d('forest','Giant Sequoia Grove','California, USA',36.7,-118.8,'forest','The most massive living things on earth.','sequoia grove aerial drone giant cinematic','giant tree grove aerial timelapse'),
  d('forest','Munnar Tea Hills','Kerala, India',10.1,77.1,'forest','Tea plantations on steep slopes wrapped in cloud.','munnar tea hills aerial drone cinematic','tea plantation hill aerial timelapse'),
  d('forest','Tarkine Rainforest','Tasmania, Australia',-41.5,145.5,'forest','The largest cool-temperate rainforest in the Southern Hemisphere.','tarkine rainforest aerial drone tasmania cinematic','temperate rainforest aerial timelapse tasmania'),
  d('forest','Borneo Rainforest','Malaysia',2.0,115.0,'forest','One of the oldest rainforests on earth. Orangutans swing overhead.','borneo rainforest aerial drone cinematic','orangutan rainforest aerial timelapse'),
  d('forest','Alishan Forest','Taiwan',23.5,120.8,'forest','Ancient red cypress trees and a sea of clouds at dawn.','alishan forest aerial drone taiwan cinematic','cloud forest aerial timelapse taiwan'),
  d('forest','Crooked Forest','Poland',53.4,14.6,'forest','300 pine trees all bent 90 degrees north at the base. Nobody knows why.','crooked forest aerial drone poland cinematic','curved forest aerial timelapse mystery'),
  d('forest','Knysna Forest','South Africa',-34.0,23.0,'ocean','South Africa last ancient forest. Elephants still hide here.','knysna forest aerial drone south africa cinematic','african forest aerial timelapse elephant'),
  d('forest','Waipoua Kauri','New Zealand',-35.6,173.6,'forest','Home to Tane Mahuta — Lord of the Forest, 2000 years old.','kauri forest aerial drone new zealand cinematic','ancient tree aerial timelapse new zealand'),
  d('forest','Periyar Forest','Kerala, India',9.5,77.2,'forest','Elephants, tigers, and ancient spice trees in dramatic reserve.','periyar forest aerial drone kerala cinematic','indian forest aerial timelapse elephants'),
  d('forest','Sagarmatha Rhododendron','Nepal',27.8,86.7,'forest','The highest rhododendron forests burst into crimson every spring.','nepal rhododendron forest aerial drone cinematic','himalayan forest aerial timelapse bloom'),

  // MOUNTAINS
  d('mountain','Swiss Alps','Switzerland',46.6,8.0,'wind','Your problems return to their actual size here.','swiss alps aerial drone snow cinematic','alpine mountain aerial timelapse dramatic'),
  d('mountain','Dolomites','South Tyrol, Italy',46.5,11.8,'wind','Pink-lit towers rising from meadows. The earth showing off.','dolomites aerial drone peaks sunset cinematic','rocky mountain spires aerial timelapse'),
  d('mountain','Torres del Paine','Patagonia, Chile',-50.9,-73.4,'wind','Granite towers at the bottom of the earth.','patagonia aerial drone granite cinematic','granite mountain aerial timelapse wind'),
  d('mountain','Geirangerfjord','Norway',62.1,7.2,'forest','Water like glass. Waterfalls threading down from a thousand metres.','geirangerfjord aerial drone fjord cinematic','fjord aerial timelapse norway scenic'),
  d('mountain','Milford Sound','New Zealand',-44.7,167.9,'forest','Sheer cliffs, silver water, a stillness that reaches into your chest.','milford sound aerial drone fiord cinematic','fiord aerial timelapse cliffs scenic'),
  d('mountain','Banff National Park','Canada',51.5,-116.1,'wind','Turquoise glacial lakes beneath snow-capped peaks.','banff aerial drone lake mountain cinematic','glacial lake aerial timelapse canada'),
  d('mountain','Lofoten Islands','Norway',68.2,13.6,'forest','Red cabins against arctic peaks and still black water.','lofoten aerial drone arctic cinematic','arctic village aerial timelapse fjord'),
  d('mountain','Hallstatt','Austria',47.6,13.7,'forest','Mirror lake, salt mountain, a village time forgot.','hallstatt aerial drone lake cinematic','alpine village aerial timelapse lake'),
  d('mountain','Everest Region','Nepal',27.9,86.9,'wind','Roof of the world. Prayer flags. Silence so complete it changes you.','himalayas aerial drone snowcapped cinematic','himalayan peaks aerial timelapse dramatic'),
  d('mountain','Machu Picchu','Peru',-13.2,-72.5,'forest','Inca city floating above the clouds.','machu picchu aerial drone ruins cinematic','ancient ruins aerial timelapse mist'),
  d('mountain','Grand Canyon','Arizona, USA',36.1,-112.1,'wind','A mile deep and two billion years old. Time itself made visible.','grand canyon aerial drone dramatic cinematic','canyon aerial timelapse sunrise layers'),
  d('mountain','Mount Fuji','Japan',35.4,138.7,'wind','Japan sacred mountain reflected in still lakes.','mount fuji aerial drone reflection cinematic','fuji mountain aerial timelapse sunrise'),
  d('mountain','Kilimanjaro','Tanzania',-3.1,37.4,'wind','Africa highest peak. Snow on the equator.','kilimanjaro aerial drone summit cinematic','africa mountain aerial timelapse cloud'),
  d('mountain','Scottish Highlands','Scotland',57.5,-4.5,'forest','Heather moor, ancient lochs, skies different every minute.','scottish highlands aerial drone loch cinematic','scotland aerial timelapse mist heather'),
  d('mountain','Zhangjiajie','Hunan, China',29.3,110.4,'forest','Pillar mountains through cloud. The landscape that inspired Pandora.','zhangjiajie aerial drone pillar cinematic','floating mountain aerial timelapse mist'),
  d('mountain','Trolltunga','Norway',60.1,6.7,'wind','A jutting rock 700m above a fjord lake.','trolltunga aerial drone cliff fjord cinematic','cliff ledge aerial timelapse fjord'),
  d('mountain','Bryce Canyon','Utah, USA',37.6,-112.2,'wind','Thousands of hoodoos glowing orange at sunrise.','bryce canyon aerial drone hoodoos cinematic','hoodoos aerial timelapse sunrise orange'),
  d('mountain','Zion National Park','Utah, USA',37.3,-113.0,'wind','Sandstone walls in red, pink, cream. Ancient and immovable.','zion national park aerial drone canyon cinematic','red canyon aerial timelapse sandstone'),
  d('mountain','Meteora','Greece',39.7,21.6,'wind','Monasteries perched atop towering rock pillars.','meteora aerial drone monastery cinematic','rock pillar monastery aerial timelapse'),
  d('mountain','Patagonia Fitz Roy','Argentina',-49.3,-73.1,'wind','The jagged spire of Mount Fitz Roy above glacial lakes.','fitz roy aerial drone patagonia cinematic','patagonia spire aerial timelapse glacial'),
  d('mountain','Huangshan','Anhui, China',30.1,118.2,'forest','Yellow Mountains in mist. The most painted mountains in Chinese art.','huangshan mountains aerial drone mist cinematic','chinese mountain mist aerial timelapse'),
  d('mountain','Aoraki Mount Cook','New Zealand',-43.6,170.1,'wind','New Zealand highest peak reflected in Hooker Lake.','mount cook aerial drone new zealand cinematic','new zealand mountain aerial timelapse glacier'),
  d('mountain','Faroe Cliffs','Denmark',62.0,-6.8,'wind','Vertical basalt into Atlantic ocean. Puffins everywhere.','faroe islands cliff aerial drone cinematic','atlantic cliff aerial timelapse puffin'),
  d('mountain','Georgian Caucasus','Georgia',42.5,44.5,'wind','Europe highest range outside Alps, wild and unknown.','caucasus mountains georgia aerial drone cinematic','georgia mountain aerial timelapse'),
  d('mountain','Ethiopian Simien','Ethiopia',13.3,38.3,'wind','Gelada baboons on escarpments 3000m above Africa.','simien mountains ethiopia aerial drone cinematic','africa mountain aerial timelapse baboon'),
  d('mountain','Laugavegur Highlands','Iceland',64.0,-19.5,'wind','Steaming vents, obsidian deserts, rhyolite mountains in every colour.','iceland highlands aerial drone cinematic','volcanic highland aerial timelapse colourful'),
  d('mountain','Tepuis Venezuela','Venezuela',5.0,-62.0,'wind','Ancient tabletop mountains older than the Andes.','tepui venezuela aerial drone cinematic','tabletop mountain aerial timelapse jungle'),
  d('mountain','Virunga Mountains','Rwanda',-1.5,29.5,'forest','Volcanic range where you come face to face with mountain gorillas.','virunga mountains aerial drone rwanda cinematic','volcanic mountain aerial timelapse gorilla'),

  // DESERT
  d('desert','Sahara Dunes','Morocco',31.1,-4.0,'wind','In the quiet of sand and sky, your mind finally has room to breathe.','sahara desert aerial drone dunes cinematic','sand dunes aerial timelapse sunset'),
  d('desert','Wadi Rum','Jordan',29.6,35.4,'wind','The Valley of the Moon. The sandstone keeps time differently.','wadi rum aerial drone red rock cinematic','red desert aerial timelapse canyon'),
  d('desert','Monument Valley','USA',37.0,-110.1,'wind','Red buttes carved over 50 million years.','monument valley aerial drone buttes cinematic','desert buttes aerial timelapse sunrise'),
  d('desert','Sossusvlei','Namibia',-24.7,15.3,'wind','Red dunes 300m high. Dead tree. Ancient salt pan.','sossusvlei aerial drone red dunes cinematic','namibia dunes aerial timelapse'),
  d('desert','Cappadocia','Turkey',38.7,34.8,'wind','Fairy chimneys and balloons at first light.','cappadocia aerial drone balloon sunrise cinematic','balloon sunrise aerial timelapse turkey'),
  d('desert','Uluru','Australia',-25.3,131.0,'wind','Six hundred million years old, blood-red at dusk.','uluru aerial drone sunset outback cinematic','red monolith aerial timelapse dusk'),
  d('desert','White Sands','USA',32.8,-106.3,'wind','Gypsum dunes white as snow, warm to the touch.','white sands aerial drone gypsum cinematic','white dunes aerial timelapse minimal'),
  d('desert','Atacama Desert','Chile',-22.9,-68.2,'wind','The driest desert. Night sky holds the most stars imaginable.','atacama aerial drone volcanic cinematic','atacama desert aerial timelapse night'),
  d('desert','Death Valley','USA',36.5,-117.1,'wind','The hottest place on earth. Cracked salt and impossible colour.','death valley aerial drone salt flat cinematic','salt flat desert aerial timelapse'),
  d('desert','Salar de Uyuni','Bolivia',-20.1,-67.5,'wind','The world largest salt flat. The sky reflects perfectly below.','salar uyuni aerial drone salt flat cinematic','salt flat aerial timelapse sky reflection'),
  d('desert','Gobi Desert','Mongolia',43.0,105.0,'wind','Ancient trading routes, dinosaur fossils, older silence.','gobi desert aerial drone steppe cinematic','mongolian desert aerial timelapse'),
  d('desert','Wahiba Sands','Oman',22.0,59.0,'wind','Arabian desert at its most cinematic. Dunes like gold waves at dusk.','wahiba sands aerial drone oman cinematic','arabian dunes aerial timelapse gold'),
  d('desert','Painted Desert','Arizona, USA',35.1,-110.3,'wind','Badlands in purple, red and orange. Earth as art.','painted desert aerial drone arizona cinematic','colorful badlands aerial timelapse'),
  d('desert','Zhangye Danxia','China',38.9,100.1,'wind','Rainbow mountains of extraordinary colour.','zhangye danxia aerial drone rainbow cinematic','rainbow mountain aerial timelapse china'),
  d('desert','Canyonlands','Utah, USA',38.3,-109.9,'wind','Canyons carved by the Colorado River.','canyonlands aerial drone utah cinematic','canyon aerial timelapse layers red'),
  d('desert','Arches National Park','Utah, USA',38.7,-109.6,'wind','Thousands of stone arches in red desert.','arches national park aerial drone cinematic','red arches aerial timelapse utah'),
  d('desert','Tibetan Plateau','Tibet',32.0,91.0,'wind','The Roof of the World. Salt lakes, yaks, a sky impossibly close.','tibet plateau aerial drone cinematic','tibetan plateau aerial timelapse sky'),
  d('desert','Namib Dead Vlei','Namibia',-24.7,15.3,'wind','900-year-old dead trees in a calcified pan. Time stopped here.','dead vlei aerial drone namibia cinematic','dead tree desert aerial timelapse'),
  d('desert','Sonoran Desert','USA',32.0,-112.0,'wind','The most biodiverse desert. Saguaro cacti like sentinels.','sonoran desert aerial drone cinematic','saguaro cactus aerial timelapse arizona'),
  d('desert','Bardenas Reales','Spain',42.2,-1.6,'wind','Spanish badlands — lunar landscape of eroded clay and gypsum.','bardenas reales aerial drone spain cinematic','spain badlands aerial timelapse'),
  d('desert','Karakum Crater','Turkmenistan',39.0,59.0,'wind','The Darvaza gas crater burns in the middle of a vast desert.','karakum desert crater aerial drone cinematic','burning crater aerial timelapse desert'),

  // GARDEN
  d('garden','Keukenhof Gardens','Netherlands',52.3,4.6,'forest','Seven million flowers blooming because that is what they do.','keukenhof aerial drone tulips cinematic','tulip field aerial timelapse colorful'),
  d('garden','Lavender Fields','Provence, France',43.9,5.4,'forest','Purple calm, row upon row, lit gold at the edges.','lavender field aerial drone provence cinematic','lavender aerial timelapse purple sunset'),
  d('garden','Cherry Blossoms','Kyoto, Japan',35.0,135.8,'forest','Pink petals falling for two brief weeks. Japan as a dream.','cherry blossom aerial drone sakura cinematic','sakura aerial timelapse pink spring'),
  d('garden','Hitachi Seaside','Ibaraki, Japan',36.4,140.6,'forest','4.5 million blue nemophila flowers over rolling hills.','hitachi nemophila aerial drone cinematic','blue flowers aerial timelapse rolling hills'),
  d('garden','Monet Garden','Giverny, France',49.1,1.5,'forest','The garden that inspired the Water Lilies.','monet garden aerial drone lily pond cinematic','waterlily garden aerial timelapse'),
  d('garden','Dutch Tulip Fields','Netherlands',52.5,4.7,'forest','Stripe after stripe of red, yellow, pink and purple.','tulip fields aerial drone netherlands cinematic','tulip rows aerial timelapse spring'),
  d('garden','Versailles Gardens','France',48.8,2.1,'forest','Symmetry and ambition made into landscape.','versailles aerial drone garden fountain cinematic','formal garden aerial timelapse france'),
  d('garden','Majorelle Garden','Morocco',31.6,-8.0,'forest','Vivid cobalt blue in the heart of Marrakech.','majorelle garden aerial drone blue cinematic','blue garden aerial timelapse morocco'),
  d('garden','Alhambra Gardens','Granada, Spain',37.2,-3.6,'forest','Moorish water gardens, courtyards, fountains.','alhambra garden aerial drone courtyard cinematic','moorish garden aerial timelapse'),
  d('garden','Ryoanji','Kyoto, Japan',35.0,135.7,'forest','The most famous Zen rock garden. Fifteen stones, raked gravel, silence.','ryoanji zen garden aerial drone cinematic','zen garden aerial timelapse kyoto'),
  d('garden','Val Orcia','Tuscany, Italy',43.1,11.6,'forest','Cypress-lined lanes and rolling Tuscan landscape.','tuscany val dorcia aerial drone cinematic','tuscan landscape aerial timelapse rolling'),
  d('garden','Highland Heather','Scotland',57.0,-4.8,'forest','Scottish moorland ablaze with purple heather.','scotland heather aerial drone cinematic','highland heather aerial timelapse purple'),
  d('garden','Wisteria Tunnel','Kawachi, Japan',33.5,130.5,'forest','A 100-metre tunnel of hanging purple wisteria. Ten days in bloom.','wisteria tunnel japan aerial drone cinematic','purple wisteria aerial timelapse japan'),
  d('garden','Ninfa Gardens','Lazio, Italy',41.5,13.0,'forest','Medieval ruins swallowed by one of the most romantic gardens.','ninfa gardens aerial drone italy cinematic','ruined garden aerial timelapse romantic'),
  d('garden','Villa dEste Gardens','Tivoli, Italy',41.9,12.8,'forest','Renaissance fountains and terraced gardens. Water everywhere.','villa d este aerial drone italy cinematic','renaissance garden aerial timelapse fountain'),
  d('garden','Cloud Forest Singapore','Singapore',1.3,103.9,'forest','A 35m mountain inside a glass dome, covered in cloud forest.','cloud forest dome singapore aerial drone cinematic','dome garden aerial timelapse singapore'),
  d('garden','Powerscourt Gardens','Ireland',53.2,-6.2,'forest','Ireland most celebrated garden — terraces above Wicklow mountains.','powerscourt garden aerial drone ireland cinematic','irish garden aerial timelapse mountain'),
  d('garden','Generalife','Granada, Spain',37.2,-3.6,'forest','Summer palace gardens of the Nasrid sultans. Water, roses, shade.','generalife garden aerial drone granada cinematic','moorish palace garden aerial timelapse'),

  // WATERFALLS
  d('waterfall','Iguazu Falls','Argentina & Brazil',-25.7,-54.4,'rain','275 waterfalls across three kilometres. The most powerful release on earth.','iguazu falls aerial drone mist cinematic','massive waterfall aerial timelapse rainbow'),
  d('waterfall','Victoria Falls','Zambia & Zimbabwe',-17.9,25.9,'rain','Mosi-oa-Tunya — The Smoke That Thunders.','victoria falls aerial drone mist cinematic','africa waterfall aerial timelapse mist'),
  d('waterfall','Skogafoss','South Iceland',63.5,-19.5,'rain','Sixty metres of mist and rainbows.','skogafoss aerial drone waterfall cinematic','iceland waterfall aerial timelapse rainbow'),
  d('waterfall','Horseshoe Falls','Ontario, Canada',43.1,-79.1,'rain','Three million litres per second. You feel mercifully small.','niagara aerial drone waterfall cinematic','niagara aerial timelapse power mist'),
  d('waterfall','Yosemite Falls','California, USA',37.8,-119.6,'rain','North America tallest waterfall threading down granite.','yosemite falls aerial drone granite cinematic','tall waterfall aerial timelapse granite'),
  d('waterfall','Seljalandsfoss','South Iceland',63.6,-20.0,'rain','One of the only waterfalls you can walk completely behind.','seljalandsfoss aerial drone cinematic','iceland waterfall aerial timelapse cave'),
  d('waterfall','Angel Falls','Venezuela',5.9,-62.5,'rain','979 metres of free fall. One of the most breathtaking things on earth.','angel falls aerial drone venezuela cinematic','highest waterfall aerial timelapse jungle'),
  d('waterfall','Havasu Falls','Arizona, USA',36.2,-112.7,'rain','Vivid blue-green water against red canyon walls.','havasu falls aerial drone blue cinematic','blue waterfall aerial timelapse canyon red'),
  d('waterfall','Multnomah Falls','Oregon, USA',45.6,-122.1,'rain','A two-tiered waterfall in old-growth forest.','multnomah falls aerial drone forest cinematic','forest waterfall aerial timelapse bridge'),
  d('waterfall','Rhine Falls','Switzerland',47.7,8.6,'rain','Central Europe most powerful waterfall.','rhine falls aerial drone switzerland cinematic','european waterfall aerial timelapse'),
  d('waterfall','Gullfoss','Iceland',64.3,-20.1,'rain','The Golden Falls plunging into a gorge.','gullfoss aerial drone iceland cinematic','iceland golden falls aerial timelapse'),
  d('waterfall','Dettifoss','Iceland',65.8,-16.4,'rain','The most powerful waterfall in Europe.','dettifoss aerial drone iceland cinematic','powerful waterfall aerial timelapse europe'),
  d('waterfall','Plitvice Falls','Croatia',44.9,15.6,'rain','Terraced lakes and hundreds of small falls through forest.','plitvice waterfalls aerial drone cinematic','terrace waterfall aerial timelapse turquoise'),
  d('waterfall','Erawan Falls','Thailand',14.4,99.1,'rain','Seven-tiered emerald waterfall through the jungle.','erawan waterfall aerial drone cinematic','tiered waterfall aerial timelapse jungle'),
  d('waterfall','Kuang Si Falls','Laos',19.8,102.0,'rain','Turquoise blue stepped pools through the Laos jungle.','kuang si falls aerial drone laos cinematic','turquoise waterfall aerial timelapse laos'),
  d('waterfall','Tumpak Sewu','East Java, Indonesia',-8.2,112.9,'rain','A curtain waterfall — 100m wide, dropping simultaneously into a canyon.','tumpak sewu aerial drone cinematic','curtain waterfall aerial timelapse java'),
  d('waterfall','Bigar Waterfall','Romania',44.9,21.9,'rain','A delicate mossy cascade — one of the most beautiful in the world.','bigar waterfall aerial drone romania cinematic','moss waterfall aerial timelapse romania'),
  d('waterfall','Rainbow Falls','Maui, Hawaii',20.9,-156.2,'rain','A cave hidden behind the falls where the moon goddess was said to live.','rainbow falls hawaii aerial drone cinematic','hawaii falls aerial timelapse rainbow'),
  d('waterfall','Cascadas Agua Azul','Mexico',17.3,-92.1,'rain','Brilliant turquoise limestone waterfalls through jungle.','agua azul waterfall aerial drone cinematic','turquoise cascade aerial timelapse'),

  // CITIES
  d('city','Shinjuku at Night','Tokyo, Japan',35.7,139.7,'forest','A city that never stops. Neon rivers, machine light, ten million lives.','tokyo shinjuku night aerial drone cinematic','city night lights aerial timelapse neon'),
  d('city','Montmartre','Paris, France',48.9,2.3,'forest','Cobblestones, cafes, the Eiffel Tower winking. It is always Paris.','paris aerial drone eiffel tower cinematic','paris aerial timelapse golden romantic'),
  d('city','Sultanahmet','Istanbul, Turkey',41.0,29.0,'forest','Two continents meeting. The call to prayer at dusk.','istanbul aerial drone mosque sunset cinematic','istanbul aerial timelapse bosphorus'),
  d('city','Gothic Quarter','Barcelona, Spain',41.4,2.2,'forest','Gaudi around every corner. Beauty as a daily choice.','barcelona aerial drone gaudi cinematic','barcelona aerial timelapse architecture'),
  d('city','Alfama Lisbon','Portugal',38.7,-9.1,'forest','Fado from windows. Yellow trams on cobbled hills.','lisbon aerial drone tram hills cinematic','lisbon aerial timelapse cobblestone'),
  d('city','Djemaa el-Fna','Morocco',31.6,-8.0,'forest','Smoke, spice, music, storytellers at dusk.','marrakech aerial drone medina cinematic','marrakech aerial timelapse rooftop'),
  d('city','Victoria Harbour','Hong Kong',22.3,114.2,'forest','The most dramatic skyline on earth.','hong kong aerial drone skyline cinematic','hong kong aerial timelapse harbour'),
  d('city','Prague Old Town','Czech Republic',50.1,14.4,'forest','Baroque spires, cobbled squares, a river of a thousand years.','prague aerial drone old town cinematic','prague aerial timelapse river bridge'),
  d('city','Vienna','Austria',48.2,16.4,'forest','Music, architecture, coffee houses. The most refined city.','vienna aerial drone opera house cinematic','vienna aerial timelapse golden'),
  d('city','New York at Dusk','New York, USA',40.7,-74.0,'forest','Eight million lives on one island. The city that never needed an excuse.','new york aerial drone skyline cinematic','manhattan aerial timelapse brooklyn bridge'),
  d('city','Sydney Harbour','NSW, Australia',-33.9,151.2,'ocean','Opera House, Harbour Bridge, a bay that catches every sunset.','sydney aerial drone opera house cinematic','sydney aerial timelapse harbour sunset'),
  d('city','Florence Arno','Tuscany, Italy',43.8,11.3,'forest','Renaissance art and Arno sunsets. Beauty as a profession.','florence aerial drone arno bridge cinematic','florence aerial timelapse renaissance'),
  d('city','Amsterdam Canals','Netherlands',52.4,4.9,'forest','Bicycle bells, reflected lights, houses at impossible angles.','amsterdam aerial drone canal night cinematic','amsterdam aerial timelapse canal lights'),
  d('city','Copenhagen Nyhavn','Denmark',55.7,12.6,'forest','Colourful merchants houses along a harbour canal.','copenhagen aerial drone nyhavn cinematic','copenhagen aerial timelapse canal'),
  d('city','Chefchaouen','Morocco',35.2,-5.3,'forest','The Blue City. Every surface painted in shades of blue.','chefchaouen aerial drone blue cinematic','blue city aerial timelapse morocco'),
  d('city','Edinburgh','Scotland',55.9,-3.2,'forest','A castle on volcanic rock, old town stacked below.','edinburgh aerial drone castle cinematic','edinburgh aerial timelapse castle rock'),
  d('city','Kyoto Gion','Kyoto, Japan',35.0,135.8,'forest','Lantern-lit alleys, a city that chose culture over convenience.','kyoto aerial drone gion night cinematic','kyoto aerial timelapse traditional'),
  d('city','Varanasi Ghats','India',25.3,83.0,'forest','The oldest living city. Dawn prayers on the Ganges. Sacred.','varanasi aerial drone ganges cinematic','india ghats aerial timelapse sacred'),
  d('city','Petra','Jordan',30.3,35.4,'wind','The Rose-Red City carved into sandstone. 2000 years old.','petra aerial drone ancient city cinematic','petra aerial timelapse sandstone'),
  d('city','Budapest','Hungary',47.5,19.1,'forest','The most beautiful city on the Danube. Parliament and light.','budapest aerial drone danube cinematic','budapest aerial timelapse parliament night'),
  d('city','Reykjavik','Iceland',64.2,-21.9,'forest','The world northernmost capital. Colourful houses and aurora.','reykjavik aerial drone aurora cinematic','iceland city aerial timelapse aurora'),
  d('city','Samarkand','Uzbekistan',39.7,67.0,'forest','Silk Road city of extraordinary tilework. Timeless.','samarkand aerial drone silk road cinematic','uzbekistan tile city aerial timelapse'),
  d('city','Luang Prabang','Laos',19.9,102.1,'forest','Buddhist temples, saffron monks, and French colonial charm.','luang prabang aerial drone temple cinematic','laos temple aerial timelapse monks'),
  d('city','Cartagena','Colombia',10.4,-75.5,'forest','Colonial city of colour, music, and warmth by the Caribbean.','cartagena aerial drone colonial cinematic','colombia colonial aerial timelapse'),
  d('city','Valletta','Malta',35.9,14.5,'ocean','The world smallest capital. Baroque grandeur on a Mediterranean peninsula.','valletta aerial drone malta cinematic','malta aerial timelapse baroque sea'),
  d('city','Hoi An','Vietnam',15.9,108.3,'forest','Ancient port city of lanterns — the most charming in Asia.','hoi an aerial drone lanterns cinematic','lantern city aerial timelapse vietnam'),
  d('city','Tbilisi','Georgia',41.7,44.8,'forest','A city built over hot springs. Carved balconies. Wine in every house.','tbilisi aerial drone georgia cinematic','caucasus city aerial timelapse balcony'),
  d('city','Bagan','Myanmar',21.2,94.9,'forest','4000 ancient temples across a plain. Sunrise by hot air balloon.','bagan temples aerial drone cinematic','temple city aerial timelapse myanmar'),
  d('city','Valparaiso','Chile',-33.0,-71.6,'ocean','42 hillside neighbourhoods of colour, chaos, and poetry.','valparaiso aerial drone chile cinematic','colorful hillside city aerial timelapse'),

  // ARCTIC
  d('arctic','Aurora Borealis','Tromso, Norway',69.7,19.0,'wind','The sky dancing in green and violet. A moment you forget everything else.','aurora borealis aerial drone cinematic 4k','northern lights aerial timelapse sky 4k'),
  d('arctic','Jokulsarlon Lagoon','Vatnajokull, Iceland',64.1,-16.2,'wind','Aurora reflected in a glacial lagoon with blue icebergs.','jokulsarlon aerial drone aurora iceberg cinematic','glacier lagoon aerial timelapse aurora'),
  d('arctic','Finnish Lapland','Lappi, Finland',68.9,27.1,'wind','Reindeer, frozen forests, glass-roofed cabins under the wheeling stars.','lapland aerial drone aurora snow cinematic','aurora snow aerial timelapse finland'),
  d('arctic','Lofoten Winter','Nordland, Norway',68.2,13.6,'wind','Frozen fjords, white peaks, aurora-lit water.','lofoten aerial drone winter aurora cinematic','arctic fjord aerial timelapse aurora snow'),
  d('arctic','Ilulissat Icefjord','Greenland',69.2,-51.1,'wind','This ice fell as snow 100000 years ago.','ilulissat aerial drone iceberg glacier cinematic','arctic iceberg aerial timelapse fjord'),
  d('arctic','Diamond Beach','Iceland',63.9,-17.7,'wind','Icebergs on a black sand beach. Ice and fire.','diamond beach aerial drone iceland cinematic','iceland black beach iceberg aerial timelapse'),
  d('arctic','Abisko Aurora','Swedish Lapland',68.4,18.8,'wind','The clearest skies in Scandinavia for aurora viewing.','abisko aurora aerial drone cinematic 4k','aurora dark sky aerial timelapse 4k'),
  d('arctic','Yukon Northern Lights','Yukon, Canada',63.1,-139.4,'wind','Canada vast wilderness under aurora displays.','yukon aurora aerial drone cinematic','canada wilderness aurora aerial timelapse'),
  d('arctic','Alaska Denali','Alaska, USA',63.3,-150.5,'wind','North America highest peak. Bears, moose, and sky bigger than everything.','alaska denali aerial drone mountain cinematic','alaska mountain aerial timelapse'),
  d('arctic','Svalbard','Norway',78.2,15.7,'wind','Polar bears, midnight sun, a silence so deep it changes you.','svalbard aerial drone polar wilderness cinematic','arctic wilderness aerial timelapse polar'),
  d('arctic','Greenland Ice Sheet','Greenland',68.0,-44.0,'wind','An ocean of white from horizon to horizon.','greenland ice sheet aerial drone cinematic','greenland aerial timelapse ice vast'),
  d('arctic','Antarctic Peninsula','Antarctica',-64.3,-57.8,'wind','The final frontier. Penguins, ice shelves, no light pollution.','antarctica aerial drone ice cinematic','antarctica aerial timelapse penguin ice'),
  d('arctic','Faroe Islands','Denmark',62.0,-6.8,'wind','Grass-roofed villages on dramatic Atlantic cliffs.','faroe islands aerial drone cliffs cinematic','atlantic cliff aerial timelapse faroe'),
  d('arctic','Finnish Lapland Snow','Finland',68.9,27.0,'wind','Snow-laden trees and a total silence more restorative than sleep.','finland snow forest aerial drone cinematic','snowy forest aerial timelapse finland'),
  d('arctic','Midnight Sun Lofoten','Norway',67.5,15.5,'wind','The sun that never sets. Gilded landscapes at midnight.','norway midnight sun aerial drone cinematic','midnight sun aerial timelapse norway'),
  d('arctic','Vatnajokull Ice Cave','Iceland',64.0,-17.0,'wind','Blue ice cave inside Europe largest glacier — carved new each winter.','vatnajokull ice cave aerial drone cinematic','ice cave aerial timelapse iceland'),
  d('arctic','North Cape Norway','Norway',71.2,25.8,'wind','The northernmost point in Europe. Midnight sun over the Barents Sea.','north cape norway aerial drone cinematic','midnight sun cape aerial timelapse'),
  d('arctic','Churchill Polar Bears','Manitoba, Canada',58.8,-94.2,'wind','Polar bear capital of the world. Tundra encounters at Hudson Bay.','churchill aerial drone polar bear tundra cinematic','polar bear arctic tundra aerial timelapse'),
]

export function getDestinationById(id) {
  return DESTINATIONS.find(d => slugify(d.name) === id)
}

export function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function getProfile(dest) {
  return DEST_PROFILES[dest.name] || CAT_PROFILES[dest.cat]
}

const DIM_WEIGHTS = [1.2, 1.0, 1.5, 0.8, 1.3, 1.0]

export function matchDestination(needVector, pool = DESTINATIONS) {
  const scored = pool.map(d => {
    const p = getProfile(d)
    let dist = 0
    for (let i = 0; i < 6; i++) dist += DIM_WEIGHTS[i] * Math.pow(p[i] - needVector[i], 2)
    return { d, dist: Math.sqrt(dist) }
  }).sort((a, b) => a.dist - b.dist)

  const top = scored.slice(0, 5)
  const weights = top.map(x => 1 / (x.dist + 0.1))
  const total = weights.reduce((a, b) => a + b, 0)
  let r = Math.random() * total
  for (let i = 0; i < top.length; i++) {
    r -= weights[i]
    if (r <= 0) return top[i].d
  }
  return top[0].d
}
