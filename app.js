var officers=['D RRA','D STD','D SAF','D AUDIT','DD ASHORE STD','D HSE','AD SAF','AD OPS STDS','CNASS','NA-CNASS','ALL','MAINT OFFR'];
var statuses=['Active','Completed','On Hold','Cancelled','Filed'];
var locations=['Secretariat','Action Officer','Draft Desk','CNASS Signature','Dispatch Unit','Registry','Archive','Retrieved','First Sight'];
var actions=['Received','Assigned','Drafted','Reviewed','Submitted for Signature','Signed','Dispatched','Filed','Released','other'];
var fileIndex=["NHQ:02/85/22/SSB/VOL.","NHQ:03/10/12/SSB/VOL.","NHQ:01/130/12/SSB/VOL.","NHQ:018/28/12/SSB/VOL.","NHQ:018/5/12/SSB/VOL.","NHQ:015/103/12/SSB/VOL.","NHQ:06/1/12/SSB/VOL.","NHQ:02/3504/12/SSB/VOL.","NHQ:020/129/12/SSB/VOL","NHQ:020/145/12/SSB/VOL.","NHQ:09/54/12/SSB/VOL.","NHQ:03/73A/12/SSB/VOL.","NHQ:010/9/12/SSB/VOL.","NHQ:02/78/12/SSB/VOL.","NHQ:020/46/12/SSB/VOL.","NHQ:013/3/12/SSB/VOL.","NHQ:07/1A/23/SSB/VOL.","NHQ:010/5/12/SSB/VOL.","NHQ:02/974/12/SSB/VOL.","NHQ:020/13/19/SSB/VOL,","NHQ:015/65/12/SSB/VOL.","NHQ:020/300/12/SSB/VOL.","NHQ:06/21A/12/SSB/VOL.","NHQ:04/89/12/SSB/VOL.","NHQ:023/56/19/SSB/VOL.","NHQ:04/39/12/SSB/VOL.","NHQ:015/23A/12/SSB/VOL.","NHQ:018/4/12/SSB/VOL.","NHQ:020/129A/23/SSB/VOL.","NHQ:010/10/12/SSB/VOL.","NHQ:03/35/12/SSB/VOL.","NHQ:012/20/12/SSB/VOL.","NHQ:04/147/12/SSB/VOL.","NHQ:021/11A/20/SSB/VOL.","NHQ:015/43/12/SSB/VOL.","NHQ:06/259/12/SSB/VOL.","NHQ:06/100/12/SSB/VOL.","NHQ:020/276/12/SSB/VOL.","NHQ:02/78A/12/SSB/VOL.","NHQ:017/15/93/SSB/VOL.","NHQ:09/70/12/SSB/VOL.","014/2B/20/SSB/VOL.","NHQ:07/321/12/SSB/VOL.","NHQ:06/268/12/SSB/VOL.","NHQ:06/03/12/SSB/VOL.","NHQ:020/156/12/SSB/VOL.","NHQ:04/1A/24/SSB/VOL.","NHQ:020/126/12/SSB.VOL.","NHQ:04/8/12/SSB/VOL.","NHQ:06/16/SSB/VOL.","NHQ:011/55/12/SSB/VOL.","NHQ:020/360/12/SSB/VOL.","NHQ:09/24//12/SSB/VOL.","NHQ:07/283/12/SSB/VOL.","NHQ:021/11/12/SSB/VOL.","NHQ:08/68/12/SSB/VOL.","NHQ:09/69/12/SSB/VOL.","NHQ:05/86/24/SSB/VOL.","NHQ:015/105/25/SSB/VOL.","NHQ:012/24/12/SSB/VOL.","NHQ:023/79/12/SSB/VOL.","NHQ:011/12/21/SSB/VOL.","NHQ:02/38/3A/12/SSB/VOL.","NHQ:18/21/22/SSB/VOL.","NHQ:010/02/12/SSB/VOL.","BHQ:07/227/18/SSB/VOL.","NHQ:02/3037/12/SSB/VOL.","NHQ:020/161/12/SSB/VOL.","NHQ:07/284/12/SSB/VOL.","NHQ:04/144/12/SSB/VOL.","NHQ:02/974/12/SSB/VOL.","NHQ:020/115/12/SSB/VOL.","NHQ:06/368/12/SSB/VOL.","NHQ:08/1A/25/SSB/VOL.","NHQ:04/210/25/SSB/VOL.","NHQ:05/7/12/SSB/VOL.","NHQ:03/172/12/SSB/VOL.","NHQ:04/216/12/SSB/VOL.","NHQ:020/184/12/SSB/VOL.","NHQ:02/172/12/SSB/VOL.","NHQ:04/60/12/SSB/VOL.","NHQ:04/135/21/SSB/VOL.","NHQ:023/36/24/SSB/VOL.","NHQ:15/54/12/SSB/VOL.","NHQ:07/127/12/SSB/VOL.","NHQ:07/112/12/SSB/VOL.","NHQ:021/11/12/SSB/VOL.","NHQ:020/15/12/SSB/VOL.","NHQ:013/2/12/SSB/VOL.","NHQ:01/346/25/SSB/VOL.","NHQ:04/196/12/SSB/VOL.","NHQ:02/78B/12/SSB/VOL.","NHQ:01/49/12/SSB/VOL.","NHQ:01/66/12/SSB/VOL.","NHQ:01/143/12/SSB/VOL.","NHQ:01/345/12/SSB/VOL.","NHQ:020/277/25/SSB/VOL.","NHQ:06/16A/24/SSB/VOL.","NHQ:05/87/24/SSB/VOL.","NHQ:013/1/12/SSB/VOL.","NHQ:013/24/12/SSB/VOL.","NHQ:013/13/12/SSB/VOL.","NHQ:015/104/24/SSB/VOL.","NHQ:018/2/12/SSB/VOL.","NHQ:020/2/12/SSB/VOL.","NHQ:08/90/12/SSB/VOL.","NHQ:08/92/12/SSB/VOL.","NHQ:08/99/12/SSB/VOL.","NHQ:10/01/12/SSB/VOL.","NHQ:011/52A/12/SSB/VOL.","NHQ:011/56/12/SSB/VOL.","NHQ:011/57/12/SSB/VOL.","NHQ:011/108/12/SSB/VOL.","NHQ:011/109/12/SSB/VOL.","NHQ:011/111/12/SSB/VOL.","NHQ:014/2/SSB/VOL.","NHQ:015/13/12/SSB/VOL.","NHQ:015/17/12/SSB/VOL.","NHQ:015/21/12/SSB/VOL.","NHQ:015/26/12/SSB/VOL.","NHQ:015/30/12/SSB/VOL.","NHQ:015/34/12/SSB/VOL.","NHQ:015/40/12/SSB/VOL.","NHQ:015/41/12/SSB/VOL.","NHQ:015/45/12/SSB/VOL.","NHQ:015/64/12/SSB/VOL.","NHQ:015/70/12/SSB/VOL.","NHQ:015/24A/12/SSB/VOL.","NHQ:015/79/12/SSB/VOL.","NHQ:015/90/12/SSB/VOL.","NHQ:015/95/12/SSB/VOL.","NHQ:015/10/12/SSB/VOL.","NHQ:015/5/12/SSB/VOL.","NHQ:018/29/12/SSB/VOL.","NHQ:020/103/12/SSB/VOL.","NHQ:020/14/12/SSB/VOL.","NHQ:020/94/12/SSB/VOL.","NHQ:020/96A/12/SSB/VOL.","NHQ:020/106/12/SSB/VOL.","NHQ:020/130/12/SSB/VOL.","NHQ:020/170/12/SSB/VOL.","NHQ:020/190/12/SSB/VOL.","NHQ:020/190A/12/SSB/VOL.","NHQ:020/191/12/SSB/VOL.","NHQ:020/212/12/SSB/VOL.","NHQ:020/216/12/SSB/VOL.","NHQ:020/230/12/SSB/VOL.","NHQ:020/230A/12/SSB/VOL.","NHQ:020/230B/12/SSB/VOL.","NHQ:020/129A/12/SSB/VOL.","NHQ:022/7/12/SSB/VOL.","NHQ:023/81/12/SSB/VOL.","NHQ:06/368/12/SSB/VOL."];

function showToast(msg,type){var root=document.getElementById('toast-root');if(!root)return;var t=document.createElement('div');t.className='toast toast-'+(type||'success');t.textContent=msg;root.appendChild(t);requestAnimationFrame(function(){t.classList.add('toast-in');});setTimeout(function(){t.classList.remove('toast-in');t.classList.add('toast-out');setTimeout(function(){if(t.parentNode)t.parentNode.removeChild(t);},300);},3200);}
function saveData(){try{localStorage.setItem('nassRows',JSON.stringify(rows));localStorage.setItem('nassOfficers',JSON.stringify(officers));localStorage.setItem('nassStatuses',JSON.stringify(statuses));localStorage.setItem('nassLocations',JSON.stringify(locations));localStorage.setItem('nassActions',JSON.stringify(actions));localStorage.setItem('nassFileIndex',JSON.stringify(fileIndex));}catch(e){}}
function loadData(){try{var r=localStorage.getItem('nassRows');if(r)rows=JSON.parse(r);var o=localStorage.getItem('nassOfficers');if(o)officers=JSON.parse(o);var s=localStorage.getItem('nassStatuses');if(s)statuses=JSON.parse(s);var l=localStorage.getItem('nassLocations');if(l)locations=JSON.parse(l);var a=localStorage.getItem('nassActions');if(a)actions=JSON.parse(a);var fi=localStorage.getItem('nassFileIndex');if(fi)fileIndex=JSON.parse(fi);}catch(e){}}
var rows=[["1.","NHQ:020/278/25/VOL.I/4","CNS Directives - CNAS was to:                         (1) Ensure uniformity and standardisation of life jackets on all NN sea going vessels.","Action Officer","AD SAF","Drafted","2026-04-05","2025-12-24","2","2026-04-07","Active","ON TIME",""],["2.","255NG DTG 291537 DEC 25                                   446NG DTG 021517 FEB 26","CONDUCT OF  RANDOM EFFICACY/RELIABILITY TESTS ON BALLISTIC HELMETS VESTS AND PPE IN OWN INVENTORY","Dispatch Unit","AD SAF","Released","2026-04-05","2025-12-29","39","2026-05-14","Active","ON TIME","a. Observe poor compliance reminder 446NG released"],["3.","NHQ 271435 JAN 26 NHQ 301453 JAN  26              NHQ:020/129A/23/SSB/VOL.III/211","Evaluation of Safety Compliance in NOD","Dispatch Unit","AD SAF","Released","2026-04-05","2026-04-05","17","2026-04-22","Active","ON TIME",""],["4.","411NG  DTG 271424 JAN 26","Joint Fire Fighting Exercise with Federal Fire Service","Dispatch Unit","AD SAF","Released","2026-04-05","2026-04-05","24","2026-04-29","Active","ON TIME",""],["5.","404NG DTG 231724 JAN 26                   450NG DTG 031427 FEB 26","First Bi-Annual Audit of HSE Facilities and Compliance with Standards in Ships/Establishments","Dispatch Unit","AD SAF","Released","2026-04-05","2026-04-05","17","2026-04-22","Active","ON TIME","a. Observe poor compliance reminder 450NG released.                                             b. AD SAF to compile a comprehensive report highlighti"],["6.","NHQ:020/15/12/SSB/VOL.III/308","Request for Approval for the production of plaques for presentation to retired senior officers of the NN","Dispatch Unit","AD SAF","Dispatched","2026-04-05","2026-04-05","7","2026-04-12","Active","ON TIME","Awaiting CNS Approval"],["7.","NHQ: 01/187/12/SSB/VOL.I/06","INSPECTION OF LOGISTICS STORES IN ABUJA AREA","Dispatch Unit","AD SAF","Dispatched","2026-04-05","2026-04-05","6","2026-04-11","On Hold","ON TIME","Cancelled. New date to be communicated."],["8.","NHQ:04/196/12/SSB/VOL.I/173","Request for funds for purchase of office equipment/items","Dispatch Unit","","Dispatched","2026-04-05","2026-04-05","7","2026-04-12","Active","ON TIME","AD ASHORE STDS REFRIGERATOR - Awaiting CAB Approval"],["9.","NHQ:04/196/12/SSB/VOL.I/174","Request for funds for purchase of office equipment/items","Dispatch Unit","","Dispatched","2026-04-05","2026-04-05","7","2026-04-12","Active","ON TIME","Computer system - Awaiting CAB Approval"],["10.","NHQ:04/196/12/SSB/VOL.I/175","Request for funds for purchase of office equipment/items","Dispatch Unit","","Dispatched","2026-04-05","2026-04-05","7","2026-04-12","Active","ON TIME","Photocopier - Awaiting CAB Approval"],["11.","NHQ:015/40/12/SSB/VOL.II/80","CONVENING ORDER FOR FIRST QUARTER 2026 EVALUATION OF BASES/BARRACKS INFRASTRUCTURE AND DEFENCE PLAN IN WESTERN NAVAL COMMAND","Dispatch Unit","DD ASHORE STD","other","2026-04-05","2026-04-05","15","2026-04-20","Completed","ON TIME","CNS Approved."],["12.","NHQ:021/11/12/SSB/VOL.VI/393","Report and Executive Summary of the 2025 CNAS Advance Inspection Exercise","Dispatch Unit","AD SAF","other","2026-04-05","2026-04-05","7","2026-04-12","Active","ON TIME","CNS Approved"],["13.","NHQ:021/11/12/SSB/VOL.VI/396","Implementation of recommendation from the 2025 CNS AIE","Action Officer","AD SAF","Assigned","2026-04-05","2026-04-05","7","2026-04-12","Active","ON TIME","a. CNS Approved.                                                    b. AD SAF to BU Memos and letters to Staff Branches, Comd and Estbs for CNASS peru"],["14.","NHQ:020/129A/12/SSB/VOL./220","Request for Approval for production of safety Briefing media for Aduwo Hall and Ibas Auditorium","Action Officer","AD SAF","Assigned","2026-04-05","2026-02-10","7","2026-04-12","Active","ON TIME","Awaiting CNS Approval"],["15.","NHQ:022/2/12/SSB/VOL./","Promotional video by the Indian Navy Safety Team","Action Officer","AD SAF","Dispatched","2026-04-05","2026-04-05","7","2026-04-12","Active","ON TIME","Treat and Brief CNASS accdly"],["16.","NHQ:020/129/12/SSB/VOL.XIV/635","Procurement and Repair of Firefighting Trucks for NN","Action Officer","AD SAF","Dispatched","2026-04-05","2026-04-05","7","2026-04-12","Active","ON TIME","Awaiting CNS Approval"],["17.","NHQ","PREFACE TO THE USE OF MOTOR CYLE POLICY","Action Officer","AD SAF","Assigned","2026-04-05","2026-04-05","3","2026-04-08","Active","ON TIME","AD SAF to write a Preface completely different from the Foreword of the Policy"],["18.","NHQ:020/15/12/SSB/VOL.IV/311","Request for Approval for Procurement of shoulder Badges for NN","Action Officer","AD SAF","Signed","2026-02-11","2026-02-11","7","2026-02-18","Active","OVERDUE","Awaiting CNS Approval"],["19.","NHQ:020/129A/12/SSB/VOL./","NOP IDAH current Disaster Response EQPT plan for Emergency","Action Officer","AD SAF","Assigned","2026-04-05","2026-04-05","3","2026-04-08","Active","ON TIME","Aggregate all the recommendations of the CNC's units in a memo to CNS as what the units require to be effective DRUs"],["20.","NHQ:020/129A/12/SSB/VOL./","NNS GURARA RPT ON PPE and MOB drills conducted on 29 -30 Dec 25","Action Officer","AD SAF","Assigned","2026-04-05","2026-04-05","3","2026-04-08","Active","ON TIME","BU recommendation in a memo for CNS' consideration and nec action"],["21.","NHQ:01/130/12/SSB/VOL.I/241","HQ NAVDOC LOGREQ for Year 2026","Dispatch Unit","AD SAF","Dispatched","2026-01-23","2026-01-23","7","2026-01-30","Active","OVERDUE","Awaiting CNS Approval"],["22.","NHQ:020/15/12/SSB/VOL.III/308","Req for Approval for the production of plaques for retired senior officers","Dispatch Unit","AD SAF","Drafted","2026-03-16","2026-03-16","2","2026-02-18","Active","ON TIME","CNASS staff car- Awaiting CAB Approval"],["23.","NHQ:015/40/12/SSB/VOL.II/84","Administrative instructions for the conduct of first quarter 2026 evaluation of bases/barracks infrastructure and defence plan in western naval comman","Dispatch Unit","AD SAF","Dispatched","2026-02-17","2026-02-17","","","Completed","ON TIME","Dispatched"],["24.","NHQ:020/15/12/SSB/VOL.IV/313","Request for approval for the production of standardized staff tag casings for Nigerian Navy personnel serving at Naval Headquarters","Dispatch Unit","","Dispatched","2026-02-17","2026-02-17","7","2026-02-24","Active","ON TIME","Awaiting CNS Approval"],["25.","NHQ;04/89/12/SSB/VOL.I/159","Request for funds dor repair of CNASS staff car air conditioning system","Dispatch Unit","AD SAF","Dispatched","2026-02-19","2026-02-19","7","2026-02-26","Active","ON TIME","CNASS staff car- Awaiting CAB Approval"],["26.","NHQ:021/11/12/SSB/VOL.VI/398-416","Implementation of recommendation from the 2025 CNS AIE","Dispatch Unit","AD SAF","Dispatched","2026-02-19","2026-02-19","Nil","","Completed","ON TIME","Dispatched"],["27.","NHQ:01/143/12/SSB/VOL.II/184","Sopplementary ration cash allowance complement returns for the month of march 2026 NASS Branch - Ratings MWOWTR DADIE AU S5709 & ABMTD MUHAMMED M X164","Dispatch Unit","AD SAF","Dispatched","2026-02-20","2026-02-20","Nil","","Completed","ON TIME","Dispatched"],["28.","NHQ:01/345/12/SSB/VOL.III/329","Application for DTA/TPT/Packing allowance- Ratings MWOWTR DADIE AU S5709 & ABMTD MUHAMMED M X16411","Dispatch Unit","AD SAF","Dispatched","2026-02-20","2026-02-20","Nil","","Completed","ON TIME","Dispatched"],["29.","NHQ:01/345/12/SSB/VOL.III/330","Application for DTA/TPT/ Packing allowance- Senior Officer - R.adm CE Oji NN/1967","Dispatch Unit","AD SAF","Dispatched","2026-02-20","2026-02-20","Nil","","Completed","ON TIME","Dispatched"],["30.","NHQ:020/145/93/VOL.III/180","Report of the committee on the review of NN data tools","","","","2026-02-17","","","","","",""],["31.","NHQ/020/236/NS/VOL.VIII/14","Report of the conduct of joint fire fighting exercise with the federal fire service lokoja at CND","","","","2026-02-17","","","","","",""],["32.","NHQ:02/974/PL/VOL.XXIII/651","Summary of decisions taken at the weekly intelligence and operations brief for CNS with PSO's FOC's COMD OPDS and Directors held in V adm DJ Ezeoba on","","","","2026-02-17","","","","","",""],["33.","NHQ:010/9/12/PL/VOL/141","Re:submission of copies of published Navtrac schedule of events for policy and plans branch Naval Headquarters","","","","2026-02-17","","","","","",""],["34.","HQWNC:020/145B/VOL.I/239","Report on the conduct of Bi-annual audit of health safety and environment at Naval base EPE on the 27 Jan 26","","","","2026-02-18","","","","","",""],["35.","HQNTC:01/7/93/VOL.II/18","Report on the conduct of Bi-annual audit of HSE facilities and compliance with standard for schools and units under command","","","","2026-02-18","","","","","",""],["36.","HQWNC:04/61/15/VOL.IV/233","Naval air base earthing integrity test return for January 2026","","","","2026-02-18","","","","","",""],["37.","NHQ:018/1/93/PL/VOL.V/378","Convening order for a committee to review the amended report of the committee to plan flag showing visit to selected central african countries","","","","2026-02-18","","","","","",""],["38.","HQNTC:01/7/93/VOL.II/20","Report on the conduct of first bi-annual audit of HSE facilities and compliance with standard for schools and units under command","","","","2026-02-18","","","","","",""],["39.","NHQ:02/974/PL/VOL.XXIII/653","Minutes of the Chief of the Naval Staff 's meeting with branch chiefs held in V adm AA Aduwo hall NHQ on wed 11 Feb 26","","","","2026-02-18","","","","","",""],["40.","NHQ:018/4/23/PL/VOL.XXIII","Nomination to represent CNS at the American society of safety professionals 2026 professional development conference","","","","2026-02-18","","","","","",""],["41.","ELIZADE TOYOTA RC:11544","Elizade Nigeria Limited","","","","2026-02-18","","","","","",""],["42.","NHQ:020/300/93/VOL.XXX/27","NN military school Ikot Ntuen Earthing integrity returns for the month of Jan 26","","","","2026-02-18","","","","","",""],["43.","NHQ:10/2/NEB/VOL.I/27","Re:request for inputs on the draft on Nigerian Navy protocol handbook","","","","2026-02-19","","","","","",""],["44.","EHCON/REG/POL/1043","Commencement of national compliance monitoring on Greenhouse Gas(GHG) emission in line with section 62 of the national environmental","","","","2026-02-19","","","","","",""],["45.","NHQ:02/85/23/CIT/VOL.I/367","Temporary Appointment- Senior Officer  Cdre M Fakrogha NN/1921","","","","2026-02-19","","","","","",""],["46.","NHQ:10/2/25/TRG/VOL.I/7","Inputs on the final draft Nigerian Navy protocol handbook","","","","2026-02-20","","","","","",""],["47.","NHQ:02/85/25/TRG/VOL.I/110","Temporary Appointment- Senior Officer  Cdre A Oride NN/2041","","","","2026-02-20","","","","","",""],["48.","DNI:009/46/18/VOL.II/73","Naval intelligence summary for Jan 26","","","","2026-02-20","","","","","",""],["49.","NHQ:015/90/93/A/VOL.XIV/40","Report of the conduct of random efficacy reliability tests on ballistic helmets and ppe in naval base Abuja","","","","2026-02-20","","","","","",""],["50.","NHQ:02/974/93/PL/VOL.XXII/657","Convening order for a committee to review the nomenclature of all NN bases and outposts","","","","2026-02-20","","","","","",""],["51.","NHQ:021/11/93/PL/VOL.IV/159","Re:implementation of recommendations from the 2025 Chief of the Naval Staff advance inspection exercise","","","","2026-02-20","","","","","",""],["52.","NHQ:02/85/LOG/VOL.XIII/615","Temporary appointment - Senior Officer  Cdre DMT Kumangari NN/1953","","","","2026-02-23","","","","","",""],["53.","NHQ:06/286/25/TRG/VOL.I/73","Request for department paper topics for senior course 48 and junior course 101 department of maritime warfare","","","","2026-02-23","","","","","",""],["54.","NHQ:015/65/93/A/VOL.XI/111","Revised armed forces complex access control protocol","","","","2026-02-23","","","","","",""],["55.","NHQ:010/2/93/A/VOL.I/29","Re:final draft of the Nigerian Navy protocol handbook","","","","2026-02-23","","","","","",""],["56.","NHQ:015/65/23/OPS/VOL.XXXXII/226","Re:assessment of distribution and placement of fireballs at NHQ operations branch response","Action Officer","AD SAF","Assigned","2026-02-23","2026-02-23","7","2026-03-02","Active","OVERDUE","The AD SAF was tasked to compile inputs on the fireball extinguishers"],["57.","NHQ:10/02/NS/VOL.IV/13","Navsec branch input on final draft of the Nigerian Navy protocol handbook","Action Officer","AD SAF","Assigned","2026-04-05","2026-04-05","7","2026-04-12","Active","ON TIME","The AD SAF was tasked to compile inputs on protocol handbook"],["58.","NHQ:020/129/17/NS/VOL.II/143","Re:assessment of distribution and placement of fireballs at NHQ","Action Officer","AD SAF","Assigned","2026-04-05","2026-04-05","7","2026-04-12","Active","ON TIME","The AD SAF was tasked to compile inputs on the fireball extinguishers"],["59.","NHQ:020/129/25/TRG/VOL.I/3","Assessment of distribution and placement of fireballs at NHQ","Action Officer","AD SAF","Assigned","2026-04-05","2026-04-05","7","2026-04-12","Active","ON TIME","The AD SAF was tasked to compile inputs on the fireball extinguishers"],["60.","NHQ: 020/129/93/PL/VOL.III/447","Re:assessment of distribution and placement of fireballs at NHQ","Action Officer","AD SAF","Assigned","2026-04-05","2026-04-05","7","2026-04-12","Active","ON TIME","The AD SAF was tasked to compile inputs on the fireball extinguishers"],["61.","NHQ:015/105/25/PL/VOL.I/33","Re:convening order for a special operations command assessment team to inspect NN property at Egberu Rivers state for possible use as a base for NN ma","","","","2026-04-05","","","","","",""],["62.","NHQ:013/03/21/NTI/VOL.I/85","Sendforth of 5 senior officers appointed out of Naval Transformation and Innovation branch","Archive","CNASS","Filed","2026-04-05","2026-02-24","2","2026-02-26","Active","OVERDUE","NA-CNASS was directed to remind the CNASS to attend the sendforth programme"],["63.","NHQ:020/129/15/NTI/VOL.I/431","Re:assessment of distribution and placement of fireballs","Action Officer","AD SAF","Assigned","2026-04-05","2026-04-05","7","2026-04-12","Active","ON TIME","The AD SAF was tasked to compile inputs on the fireball extinguishers"],["64.","NHQ:02/974/93/PL/VOL.XXII/658","Summary of decisions taken at the weekly intelligence and operations brief for CNS with PSO's FOC's COMD OPDS and Directors held in V adm DJ Ezeoba on","Action Officer","ALL","other","2026-04-05","2026-04-05","7","2026-04-12","Active","ON TIME","All to note"],["65.","NDA/726/A","Nigerian Navy simulation centre Nigerian Defence Academy earthing integrity returns for February 2026","Action Officer","AD SAF","Assigned","2026-04-05","2026-04-05","7","2026-04-12","Active","ON TIME","The AD SAF was tasked to compile earthing integrity returns"],["66.","NHQ:010/2/16/NTI/VOL.I.14","Re:final draft of the Nigerian Navy protocol handbook","Action Officer","AD SAF","Assigned","2026-04-05","2026-04-05","7","2026-04-12","Active","ON TIME","The AD SAF was tasked to compile inputs on protocol handbook"],["67.","NHQ:01/214/14/OPS/DMAR/VOL.I/161","Request for fireballs extinguisher","Action Officer","AD SAF","Assigned","2026-04-05","2026-04-05","7","2026-04-12","Active","ON TIME","The AD SAF was tasked to compile inputs on the fireball extinguishers"],["68.","NHQ:020/15/LOG/VOL.XIII/555","Re:request for the review of NN caterers galley rig","Action Officer","","","2026-04-05","","","","","",""],["69.","NHQ:02/50/98/PL/VOL.II/394","Measures to mitigate NN medical manpower shortage","Action Officer","ALL","Assigned","2026-04-05","2026-02-25","7","2026-04-12","Active","ON TIME","All to note"],["70.","NHQ:020/129//17/AB/VOL.III/382","Re:assessment of distribution and placement of fireballs at Naval Headquarters","Action Officer","AD SAF","Assigned","2026-04-05","2026-04-05","7","2026-04-12","Active","ON TIME","The AD SAF was tasked to compile inputs on the fireball extinguishers"],["71.","NHQ:02/974/93/PL/VOL.XXII/661","Minutes of the Chief of the Naval Staff 's meeting with branch chiefs held in V adm AA Aduwo hall NHQ on wed 18 Feb 26","Action Officer","D HSE","Assigned","2026-04-05","2026-02-25","7","2026-04-12","Active","ON TIME","The D HSE was tasked to liase with the COA on the inspection of electrical appliances within NHQ"],["72.","NHQ:020/278/25/PL/VOL.I/60","Review of CNS directives for the period 1-15 feb 26","Action Officer","D STD","Filed","2026-04-05","2026-02-25","1","2026-04-06","Completed","ON TIME","The D STD was nominated to rep the CNASS"],["73.","NHQ:021/11/93/PMD/VOL.I/61","Re-implementation of recommendations from the 2025 Chief of the Naval Staff advance inspection exercise","","","","2026-04-05","","","","","",""],["74.","NHQ:0017/10H/23/VOL.I/66","HQ  NAVDOC - Arms and ammunition returns for the month of January 2026","Dispatch Unit","CNASS","Dispatched","2026-02-23","2026-02-24","1","2026-02-24","Completed","ON TIME","Dispatched"],["75.","NHQ:0017/10B/19/VOL.V/241","NAVAL DOCKYARD LIMITED - Fourth quarter returns of arms and ammunition","Dispatch Unit","CNASS","Dispatched","2026-02-23","2026-02-24","1","2026-02-24","Completed","ON TIME","Dispatched"],["76.","NHQ:0017/10B/19/VOL.V/238 & 239","HQ MARITIME COMPONENT JTF SECTORS 1&2 OPERATION FANSAN YAMMA - Arms and ammunition returns for Dec 25","Dispatch Unit","CNASS","Dispatched","2026-02-23","2026-02-24","1","2026-02-24","Completed","ON TIME","Dispatched"],["77.","NHQ:0017/10B/19/VOL.V/238 & 239","HQ MARITIME COMPONENT JTF SECTORS 1&2 OPERATION FANSAN YAMMA - Arms and ammunition returns for Jan 25","Dispatch Unit","CNASS","Dispatched","2026-02-23","2026-02-24","1","2026-02-24","Completed","ON TIME","Dispatched"],["78.","NHQ:04/89/12/SSB/VOL.I/160","Request for funds for body works and repainting of NHQ fire truck","Dispatch Unit","CNASS","Dispatched","2026-02-24","2026-02-24","7","2026-03-03","Active","OVERDUE","Dispatched"],["79.","NHQ:04/89/12/SSB/VOL.I/161","Request for funds for the replacement of submersible pump","Dispatch Unit","CNASS","Dispatched","2026-02-24","2026-02-24","7","2026-03-03","Active","OVERDUE","Dispatched"],["80.","NHQ:01/143/12/SSB/VOL.II/185","Supplementary ration cash allowance complement returns for the month of March 2026 NASS branch ratings- WORS Bitrus C X9731 and two others","Dispatch Unit","D STD","Dispatched","2026-02-24","2026-02-24","Nil","","Completed","ON TIME","Dispatched"],["81.","NHQ;06/286/12/SSB/VOL.I/34","Department paper topics for senior course 48 and junior course 101 department of maritime warfare","Dispatch Unit","CNASS","Dispatched","2026-02-24","2026-02-24","Nil","","Completed","ON TIME","Dispatched"],["82.","NHQ:01/66/12/SSB/VOL.I/83","Request for payment of non-accident bonus allowance - Rating  SMMTD Idris AI X18349","Dispatch Unit","D STD","Dispatched","2026-02-25","2026-02-25","Nil","","Completed","ON TIME","Dispatched"],["83.","NHQ:021/11/12/SSB/VOL.VI/422","Implementation of recommendations from the 2025 Chief of Naval Staff advance inspection exercise- addendum","Dispatch Unit","CNASS","Dispatched","2026-02-25","2026-02-25","Nil","","Completed","ON TIME","Dispatched"],["84.","NHQ:04/89A/12/SSB/VOL.II/31","Application for transit accommodation- Rating WORS Bitrus C X9731","Dispatch Unit","D STD","Dispatched","2026-02-26","2026-02-26","Nil","","Active","ON TIME","Dispatched"],["85.","NHQ:020/15/12/SSB/VOL.IV/314","Re:request for the review of NN caterers' galley rig","Dispatch Unit","CNASS","Dispatched","2026-02-26","2026-02-26","Nil","","Completed","ON TIME","(Dispatched) BY CNASS- Physical sample seen and confirmed qualitative. NA and CC please ensure that this is reflected when the NNUR is reviewed. 11 Ma"],["86.","NHQ:01/345/12/SSB/VOL.III/331","Application for DTA/TPT/ Packing allowance- Rating - WORS Bitrus C X9731 & ABMTD Oyaje S X10366","Dispatch Unit","D STD","Dispatched","2026-02-26","2026-02-26","Nil","","Completed","ON TIME","Dispatched"],["87.","NSL/01/90/VOL.XLVII/152","Report of joint fire ex between NSL and Nigerian fire service port harcourt","Archive","CNASS","Filed","2026-02-25","2026-02-25","Nil","","Completed","ON TIME","Filed"],["88.","NHQ:020/276/11/NTI/VOL.XXVI/10","Request for transformation achievements for DHQ and services quarterly transformation and innovation meeting","Action Officer","CNASS","Assigned","2026-02-26","2026-02-26","7","2026-03-05","Active","OVERDUE",""],["89.","NHQ:021/11/19/AB/VOL.III/218","Re-implementation of recommendations from the 2025 Chief of the Naval Staff advance inspection exercise","Action Officer","AD SAF","Assigned","2026-02-26","2026-02-26","7","2026-03-05","Active","",""],["90.","NHQ;02/974/93/PL/VOL.XXII/668","Minutes of the Chief of the Naval Staff meeting with branch chiefs held in V adm AA Aduwo hall NHQ on wed 25 feb 26","Action Officer","ALL","Assigned","2026-03-02","2026-03-02","Nil","","Filed","ON TIME",""],["91.","NHQ:02/10/12/SSB/VOL.II/408","Request for replacement of lost Nigerian Navy identity card - Rating - MWOWTR Ogbogwu AC S5633f","Dispatch Unit","D RRA","Dispatched","2026-02-27","2026-02-27","Nil","","Completed","ON TIME",""],["92.","NHQ:03/197/12/SSB/VOL.I/72","Request permission to attend the burial of late Capt JN Sule NN/3049f","Dispatch Unit","CNASS","Dispatched","2026-03-02","2026-03-02","3","","Completed","ON TIME",""],["93.","NHQ:02/974/12/SSB/VOL.XIV/379","Inspection of offices to identify substandard appliances and wirings used at the NHQ","Dispatch Unit","CNASS","Dispatched","2026-02-26","2026-02-26","Nil","","Completed","ON TIME",""],["94.","NHQ:01/345/12/SSB/VOL.III/332","Application for DTA/TPT/packing allowance - Senior Officer - R ADM PP NIMMYEL NN/1933","Dispatch Unit","D STD","Dispatched","2026-03-02","2026-03-02","Nil","","Completed","ON TIME",""],["95.","HQNAVDOC:07/283A/93/VOL.I/72","Conduct of the first bi annual workshop for commanding officer of ships in lagos and port harcourt areas","Action Officer","","","2026-04-05","","","","","",""],["96.","HQNAVDOC:014/12/7/VOL.I/156","Conduct of junior rate professional advancement examination 2026","Action Officer","D STD","Assigned","2026-04-05","","","","","",""],["97.","HQNAVDOC:014/12/7/VOL.I/157","Conduct of senior rate professional advancement examination 2026","Action Officer","D STD","Assigned","2026-04-05","","","","","",""],["98.","NHQ:02/974/93/PL/VOL.XXII/673","Summary of decisions taken at the weekly intelligence and operations brief for CNS with PSOs FOCs COMD OPDS and Directors held in V ADM DJ Ezeoba hall","","","","2026-04-05","","","","","",""],["99.","NHQ:020/236/93/NS/VOL.VII/16","CND report of first bi-annual kecture on gender mainstraming and gender violence in Nigerian Navy Barracks","","","","2026-04-05","","","","","",""],["100.","NHQ:020/300/93/VOL.XXXII/33","Convening order for a committee to recommend suitable locations for the establishment of Nigerian Navy secondary schools in Delta, Bayelsa, Lagos and","","","","2026-04-05","","","","","",""],["101.","NHQ:020/15/12/SSB/VOL.V/315","Re:proposed Nigerian Navy special operations command brooch and 70th anniversary commemorative coin brooch and ribbon","Dispatch Unit","CNASS","Dispatched","2026-03-04","2026-03-04","7","2026-03-11","Active","OVERDUE","Awaiting CNS Approval"],["102.","NHQ:020/300/12/SSB/VOL.II/115","Convening order for conduct of first quarter of Nigerian Navy welfare/NOWA schools and medical facilities from 26 March - 9 April 2026","Dispatch Unit","CNASS","Dispatched","2026-03-04","2026-03-04","7","2026-03-11","Completed","ON TIME","Approved by the CNS"],["103.","NHQ:020/276/12/SSB/VOL.V/218","Transformation achievements of the NASS branch","Dispatch Unit","CNASS","Dispatched","2026-03-04","2026-03-04","Nil","","Completed","ON TIME","Dispatched to CNTI"],["104.","NHQ:020/129/12/SSB/VOL.XVI/666","Fireballs requirement for Nigerian Navy Headquarters commands establishments units and ships","Dispatch Unit","CNASS","Dispatched","2026-04-05","2026-04-05","7","2026-04-12","Active","ON TIME","Awaiting CNS Approval"],["105.","HQWNC:07/329/VOL.I/227","Report on flooding drill for January 2026","Action Officer","AD SAF","Assigned","2026-04-05","2026-04-05","3","2026-04-08","Active","ON TIME","AD SAF was tasked to send a signal for commands to fwd a signal on damage control/ accessories of ships/boats under command"],["106.","HQWNC:04/64A/VOL.II/160","Report on operation awkward conducted at Naval Base EPE on 28-30 January 2026","Action Officer","DD ASHORE STD","Assigned","2026-04-05","2026-04-05","3","2026-04-08","Active","ON TIME","DD ASHORE STDs was tasked to treat"],["107.","HQWNC:06/121/VOL.I/181","Report on the conduct of entering fog/restricted visibility emergency exercise February 2026 - NNS FARO AND 3 OTHERS","Action Officer","AD OPS STDS","Assigned","2026-04-05","2026-04-05","3","2026-04-08","Active","ON TIME","D STD was assigned to treat"],["108.","NHQ:018/28/12/SSB/VOL.","Request for courtesy visitation to Nigerian Navy to discuss mutual partnership","Action Officer","NA-CNASS","Filed","2026-04-05","2026-04-05","Nil","","Completed","ON TIME","Action by CPPLANS"],["109.","LAN:015/9/21/VOL.I/72","Status of NNS LANA fire fighting and damage control equipment","Action Officer","AD SAF","Assigned","2026-04-05","2026-04-05","3","2026-04-08","Active","ON TIME","AD SAF was tasked to treat"],["110.","NHQ>012/24/CIT/VOL.IV/81","Allocation of Nigerian Navy intercom directory","Action Officer","D STD","Assigned","2026-04-05","2026-03-09","3","2026-04-08","Active","ON TIME","D STD was tasked to arrange collection"],["111.","NHQ:020/129/93/A/VOL.III/1","Report on joint firefighting exercise with federal fire service conducted at naval base abuja on fri 6 feb 26","","","","2026-04-05","","","","","",""],["112.","NHQ:020/129/12/SSB/VOL.XIV/667","Report on the operational state of fire fighting trucks of units under the Naval training command","Dispatch Unit","CNASS","Dispatched","2026-04-05","2026-04-05","Nil","","Completed","ON TIME","Dispatched to COL"],["113.","NHQ:01/130/12/SSB/VOL.III/242","Requirement for conduct of first bi-annual workshop for commanding officers of ships in Lagos and Port harcourt areas","Dispatch Unit","CNASS","Dispatched","2026-04-05","2026-04-05","7","2026-04-12","Active","ON TIME","Awaiting CNS Approval"],["114.","NHQ:020/129A/23/SSB/VOL.IV/282","Results of efficacy and reliability tests conducted across the Nigerian Navy formations","Dispatch Unit","CNASS","Dispatched","2026-04-05","2026-04-05","Nil","","Completed","ON TIME","Dispatched to CNS"],["115.","NHQ:015/45/12/SSB/VOL.III/528","Requirements for conduct of junior and senior rates professional advancement examinations 2026","Dispatch Unit","CNASS","Dispatched","2026-04-05","2026-04-05","7","2026-04-12","Active","ON TIME","Awaiting CNS Approval"],["116.","NHQ:01/345/12/SSB/VOL.III/333","Application for DTA/TPT/Packing allowance - Senior Officer - CAPT BL AKANBI NN/2580","Dispatch Unit","CNASS","Dispatched","2026-04-05","2026-04-05","Nil","","Completed","ON TIME","Dispatched to A&B"],["117.","NHQ:020/96A/93/A/VOL.V/45","Report of disciplinary cases incidents and detention for the month of february 2026","Action Officer","ALL","Assigned","2026-04-05","2026-04-05","Nil","","Completed","ON TIME","ALL TO NOTE"],["118.","NHQ:020/25/PL/VOL.I/71","Review of CNS directives for the period 16-28 feb 26","Action Officer","D STD","Received","2026-04-05","2026-04-05","1","2026-04-06","Active","ON TIME",""],["119.","NHQ:020/129/12/SSB/VOL","Proposal to supply and install automatic elide fire extinguisher balls in your headquarters and other auxiliary- office buildings of the Nigerian Navy","Action Officer","CNASS","Filed","2026-04-05","2026-04-05","Nil","","Active","ON TIME","Filed"],["120.","NHQ:09/69/12/SSB/VOL.","NNS SOROH returns on the state of life rafts","First Sight","CNASS","Received","2026-04-05","2026-04-05","","","Active","",""],["121.","HQ NAVDOC:015/3/92/VOL.I/70","Draft doctrine on the use of Nigerian Navy unmanned aerial system","Action Officer","D STD","Assigned","2026-04-05","2026-04-05","3","2026-04-08","Active","ON TIME","The D STD was assigned to peruse the draft doctrine and BU any matters arising. BU a memo forwarding the draft doctrine to CNS"],["122.","HQ NAVDOC:015/3/92/VOL.I/71","Draft on Nigerian Navy special operations command doctrine","Action Officer","D STD","Assigned","2026-04-05","2026-04-05","3","2026-04-08","Active","ON TIME",""],["123.","HQ NAVDOC:015/3/92/VOL.II/73","Position paper for the establishment of NAVDOC annex at Naval base Ebubu and the appointment of command doctrine officer in all NN command headquarter","Action Officer","D STD","Assigned","2026-04-05","2026-04-05","3","2026-04-08","Active","ON TIME","Please treat BU a draft memo for CNS"],["124.","NHQ:021/11/25/SSB/VOL.II/12","Re-allocation of responsibility for implementation of recommendations from the 2025 CNS advance inspection exercise","Action Officer","D STD","Assigned","2026-04-05","2026-04-05","3","2026-04-08","Active","ON TIME","The D STD was assigned to treat"],["125.","NHQ029/145/12/SSB/VOL.IV/166","Commencement of national compliance of Greenhouse Gas emissions by the environmental health council of Nigria","Dispatch Unit","CNASS","Dispatched","2026-03-12","2026-03-12","Nil","","Completed","ON TIME","Dispatched to CND"],["126.","NHQ:020/129/12/SSB/VOL.XIV/690","Standardization of life jackets for use onboard Nigerian Navy Ship","Dispatch Unit","CNASS","Dispatched","2026-04-05","2026-04-05","7","2026-04-12","Active","ON TIME","Awaiting CNS Approval"],["127.","NHQ:011/60/12/SSB/VOL.I/46","Western Naval Command report on the conduct of operation awkward at Naval base EPE from 28-30 January 2026","Dispatch Unit","CNASS","Dispatched","2026-04-05","2026-04-05","7","2026-04-12","2026-03-20 00:00:00","2026-03-20 00:00:00","Awaiting CNS Approval"],["128.","NHQ:018/4/23/PL/VOL.XXIII/583","Request CNS to attend the investiture ceremony of Gen CG Musa (RTD) HMOD as chief patron slated for Sun 29 Mar 26 from boys brigade Nigeria","Action Officer","D RRA","Assigned","2026-04-05","2026-04-05","7","2026-04-12","Active","ON TIME","The DRAA is to rep the CNS"],["129.","NHQ:02/172/12/SSB/VOL.I/175","Update of service record - Officer- LT A Ibrahim- NN/4388","Dispatch Unit","CNASS","Dispatched","2026-04-05","2026-04-05","Nil","","Completed","ON TIME","Dispatched to CAB"],["130.","NHQ:01/49/26/SSB/VOL.I/1","Request for the payment of Language allowance - Officer - LT A Ibrahim NN/4388","Dispatch Unit","DD ASHORE STD","Dispatched","2026-04-05","2026-04-05","Nil","","Completed","ON TIME","Dispatched to CAB"],["131.","NHQ:015/40/12/SSB/VOL.II/86","Report of NHQ team for the first quarter 2026 evaluation of base/ barracks infrastructure and defence plans in western naval command area of responsib","Dispatch Unit","CNASS","Received","2026-03-13","2026-03-13","7","","Completed","ON TIME","The CNASS directed DD ASHORE STDs to treat"],["132.","NHQ:020/129A/23/SSB/VOL.IV/297","Remediation of identified deficiencies during the first bi- annual audit of health safety and environment facilities and compliance with standards onb","Dispatch Unit","CNASS","Dispatched","2026-03-13","2026-03-13","7","2026-03-20","Completed","ON TIME","Awaiting CNS directives"],["133.","NHQ:021/11/12/SSB/VOL.VII/423","Allocation of responsibility for implementation of recommendations from the 2025 CNS advance inspection exercise","Dispatch Unit","CNASS","Dispatched","2026-03-13","2026-03-13","Nil","","Completed","ON TIME","Dispatched to COL"],["134.","NHQ:020/15/12/AAB/VOL.IV/316","Proposal for review and adoption of new design options for Nigerian Navy Officers ceremonial dress","Dispatch Unit","CNASS","Dispatched","2026-03-13","2026-03-13","7","2026-03-20","Active","OVERDUE","Awaiting CNS Approval"],["135.","NHQ:01/143/12/SSB/VOL.II/186","Ratings ration cash allowance complement returns for the month of April 2026 - NASS BRANCH","Dispatch Unit","CNASS","Dispatched","2026-04-05","2026-04-05","Nil","","Completed","ON TIME","Dispatched to CAB"],["136.","NHQ:01/228/12/SSB/VOL.I/182","Request for funds for the repair of air conditioning system and body work of NASS branch toyota hilux utility vehicle","Dispatch Unit","CNASS","Dispatched","2026-04-05","2026-04-05","7","2026-04-12","Active","ON TIME","Dispatched to CAB"],["137.","NHQ:01/228/12/SSB/VOL.I/183","Request for funds for the replacement of worn- out tyres of official staff car with registration number A02-393NN","Dispatch Unit","CNASS","Dispatched","2026-04-05","2026-04-05","7","2026-04-12","Active","ON TIME","Dispatched to CAB"],["138.","NHQ:01/228/12/SSB/VOL.I/184","Request for funds for the painting of official staff car with registration number A02-393NN","Dispatch Unit","CNASS","Dispatched","2026-04-05","2026-04-05","7","2026-04-12","Completed","ON TIME","Dispatched to CAB"],["139.","NHQ:04/21A/93/PL/VOL.III/238","Establishment of NOP Mfum","Action Officer","D STD","Assigned","2026-03-13","2026-03-13","7","2026-03-20","Completed","ON TIME","D STDs was assigned to treat"],["140.","NHQ:020/115/12/SSB/VOL.","Invitation to attend IWOPHAS conference 2026 international work-place environmental hazards risk assessments and security management IWOPHAS for MDAs(","Action Officer","","","2026-03-13","","","","","",""],["141.","NHQ:015/54/23/OPS/VOL.XV/181","Updated list of private maritime logistics support companies and their vessels approved by Naval Headquarters","Action Officer","","","2026-03-13","","","","","",""],["142.","NHQ:018/28/93/PL/VOL.XI/677","Re:request for courtesy visitation to Nigerian Navy to discuss mutual partnership","Action Officer","AD SAF","Assigned","2026-04-05","2026-04-05","7","2026-04-12","Active","ON TIME","AD SAF was tasked to advise and dig into the files and BU everything about ECDRMI and check for any previous enagagement and collaborations"],["143.","HQWNC:020/129/VOL.I/64","Report of committee for the conduct of evaluation of safety compliance at Naval Ordnance depot conducted from 4-6 feb 26","Action Officer","","","2026-04-05","","","","","",""],["144.","NHQ:07/127/13/LOG/VOL.IX/149","Re- weekly summary on the operational states of NN ships and air assets for week ending 20 february 2026","Action Officer","","","2026-04-05","","","","","",""],["145.","NHQ:020/300/12/SSB/VOL.II/120","Request for substitution of audit team chairman- Capt CU Nwojiji NN/2308","Dispatch Unit","CNASS","Dispatched","2026-03-17","2026-03-17","3","2026-03-20","Completed","ON TIME","Approved by the CNS"],["146.","NHQ:02/974/12/SSB/VOL.XIV/388","Re: inspection of offices to identify substandard appliances and wiring used at the NHQ","Dispatch Unit","CNASS","Dispatched","2026-03-17","2026-03-17","10","2026-03-27","Active","OVERDUE","Awaiting further directives"],["147.","NHQ:012/24/12/SSB/VOL.III/119","Request for inputs on proposed logos and mottos for newly acquired NN ships","Dispatch Unit","CNASS","Dispatched","2026-03-23","2026-03-23","7","2026-03-30","Active","OVERDUE","Awaiting CNS Approval"],["148.","HQENC:08/32/26/VOL.II/6","Report of the board of enquiry yo investigate the circumstances surrounding a fire outbreak onboard NNS Ekulu on Monday 22 Dec 25","Action Officer","CNASS","","2026-04-05","","","","","",""],["149.","HQENC:08/80/16/VOL.VIII/433","Incident report of the fire outbreak at HQ ENC PSO in 1006 officers quarters calabar on 20 february 2026","Action Officer","CNASS","","2026-04-05","","","","","",""],["150.","NHQ:018/4/12/SSB/VOL.II","Invitation to a One(1) day stakeholder engagement workshop","Dispatch Unit","CNASS","Dispatched","2026-03-23","2026-03-23","Nil","","Completed","ON TIME","Returned to NAVSEC"],["151.","NHQ:020/236/NS/VOL.II/25","Forwarding of report on conduct of lecture on armed forces act CAP A20 laws of the federation of nigeria 2004 held at Command Naval Drafting Lokoja on","Dispatch Unit","NA-CNASS","Dispatched","2026-03-23","2026-03-23","Nil","","Completed","ON TIME","Returned to NAVSEC"],["152.","NHQ:020/236/NS/VOL.II/20","Forwarding Command Naval Drafting report on conduct of lecture on basic life support held on 26 Feb 26","Dispatch Unit","NA-CNASS","Dispatched","2026-03-23","2026-03-23","Nil","","Completed","ON TIME","Dispatched to CNS"],["153.","NHQ:020/300/12/SSB/VOL.II/124","Admin instructions for the conduct of first quarter audit of NN welfare / NOWA schools & medical facilities","Dispatch Unit","CNASS","Dispatched","2026-03-23","2026-03-23","Nil","","Completed","ON TIME","Dispatched to CAB"],["154.","NHQ:018/4/93/A/VOL.I/1","Re:invitation to the opening and closing ceremonies of the armed forces inter service archery competition 2026","Action Officer","NA-CNASS","Assigned","2026-03-25","2026-03-25","2","2026-03-27","Completed","ON TIME","The NA-CNASS was tasked to ensure that the CNASS attend the event, prep the orderly/driver and to find out the dressing for the event"],["155","NOD:04/54/16/VOL.II/118","Implementation of recommendations of Chief of Naval Staff advance inspection exercise 2025:Reconstruction of weak and defective observation post in na","Action Officer","DD ASHORE STD","Assigned","2026-03-27","2026-03-27","7","2026-04-03","Active","OVERDUE",""],["156","NHQ:020/96A/26/SSB/VOL.I/59","Dispostion of officers and ratings serving in NHQ","Dispatch Unit","NA-CNASS","Dispatched","2026-03-31","2026-03-31","Nil","","Completed","ON TIME","Dispatched to COA"],["157","NHQ:015/45/12/SSB/VOL.III/531","Inputs to the draft nigreia navy doctrine on the use of unmanned aircraft systems","Dispatch Unit","CNASS","Dispatched","2026-03-24","2026-03-24","Nil","","Completed","ON TIME","Dispatched to CPPLANS"],["158","NHQ:020/300/12/SSB/VOL.II/125","Request for logistics support for first quarter audit of NN welfare/Nowa school","Dispatch Unit","CNASS","Dispatched","2026-03-24","2026-03-24","Nil","","Completed","ON TIME","Dispatched to COA"],["159","NHQ:020/300/12/SSB/VOL.II/124","Administrative instructions for the conduct of first quarter audit of Nigerian Navy welfare/NOWA school and medical facilities","Dispatch Unit","CNASS","Dispatched","2026-03-24","2026-03-24","Nil","","Completed","ON TIME","Dispatched"],["160","NHQ:018/1/2/SSB/VOL.II/109","Re:request for courtest visitation to the Nigerian Navy to discuss mutual benefit","Dispatch Unit","CNASS","Dispatched","2026-03-24","2026-03-24","Nil","","Completed","ON TIME","Dispatched to CPPLANS"],["161","NHQ:01/228/12/SSB/VOL.I/185","Request for funds for replacement of CNASS office CCTV display television","Dispatch Unit","CNASS","Dispatched","2026-03-25","2026-03-25","Nil","","Completed","ON TIME","Dispatched to CAB"],["162","NHQ:015/45/12/SSB/VOL.III/533","Re:draft Nigerian Navy special operations command doctrine FOC NAVDOC, PSO-CNS","Dispatch Unit","CNASS","Reviewed","2026-03-25","","7","2026-04-01","Active","OVERDUE","Currently undergoing review"],["163","NHQ:020/115/12/SSB/VOL.I/3","Invitation for participation of Nigerian Navy personnel in the international workplace environmental hazards risk assessments and security management","Dispatch Unit","CNASS","Reviewed","2026-03-26","","7","2026-04-02","Active","OVERDUE","Currently undergoing review"],["164","NHQ:020/129A/23/SSB/VOL.V/322","Report of committee on the conduct of evaluation of safety compliance at Naval ordnance depot","Dispatch Unit","CNASS","Dispatched","2026-03-26","2026-03-26","Nil","","Completed","ON TIME","Dispatched to CNS"],["165","NHQ:020/145/12/SSB/VOL.V/170","Commencement of National compliance of greenhouse Gas emissions by the environmental health council of Nigeria","Dispatch Unit","CNASS","Dispatched","2026-03-27","2026-03-27","Nil","","Completed","ON TIME","Dispatched to CNS"],["166","NHQ:020/129A/23/SSB/VOL.V/323","Remediation of deficiencies identified during the first bi-annual health safety and environmental audit","Dispatch Unit","CNASS","Dispatched","2026-03-27","2026-03-27","Nil","","Completed","ON TIME","Dispatched to CNS"],["167","NHQ:01/143/12/SSB/VOL.II/187","NASS branch supplementary ration cash allowance for the month of march and april 2026- Ratings","Dispatch Unit","NA-CNASS","Dispatched","2026-04-05","2026-04-05","Nil","","Completed","ON TIME","Dispatched to CAB"],["168","NHQ:015/23A/05/OPS/VOL.V/248","Need to enhance official document security in NHQ","Action Officer","ALL","Assigned","2026-03-30","2026-04-05","Nil","","Completed","ON TIME","All to note and be very careful. NA to warn ratings in the branch"],["169","NHQ:06/1/17/OPS/VOL.I/187","Review of draft riverine operations manual for the NN","Action Officer","ALL","Assigned","2026-04-05","2026-04-05","Nil","","Completed","ON TIME","All to note"],["170","DHQ/J5/POLICY/801/36","Convening order by GENERAL OO OLUYEDE (N/9318) AFM GCOR NAM CMH GSS Psc mni FCM FCMH TSM GOM CCA for a committee to collate inputs and articulate moda","Action Officer","ALL","Assigned","2026-04-05","2026-04-05","Nil","","Completed","ON TIME","All to note"],["171","NHQ:010/10/21/VOL.XII/464","Nigerian Navy order on promulgation of the revised Nigerian Navy medical standards policy","Action Officer","ALL","Assigned","2026-03-27","2026-04-05","7","2026-04-03","Active","OVERDUE","All to note"],["172","NHQ:013/3/12/SSB/VOL.II/98","Training for Commanding Navigating and Communication officers in preparation for Nigerian Navy 70th anniversary presidential fleet review","Dispatch Unit","CNASS","Dispatched","2026-03-30","2026-03-30","7","2026-04-06","Active","ON TIME","Awaiting CNS Approval"],["173","NHQ:01/345/12/SSB/VOL.III","Application for DTA/TPT/Packing allowance - Ratings- ABRP3 Otitoju MO X15386 & 3 others","Dispatch Unit","NA-CNASS","Dispatched","2026-04-05","2026-04-05","Nil","","Completed","ON TIME","Dispatched to A&B"],["174","NHQ:04/141/12/SSB/VOL.II/64","Implementation of recommendations of CNS AIE 2025- Reconstruction of work and defective observation posts in NOD","Dispatch Unit","CNASS","Dispatched","2026-04-05","2026-04-05","7","2026-04-12","Active","ON TIME","Awaiting CNS Approval"],["175","NNCAF:020/177/07/VOL.III/279","Distribution of the maiden edition of the Nigerian Navy College of Accounts and Finance magazine","Action Officer","ALL","Filed","2026-04-05","2026-04-05","7","2026-04-12","Active","ON TIME","All are to peruse and then return to CNASS office"],["176","NHQ:020/129A/23/SSB/VOL.V/322","Report of committee on the conduct of evaluation of safety compliance at Naval ordnance depot","Action Officer","D RRA","Assigned","2026-03-31","2026-04-05","7","2026-04-07","Active","ON TIME","The DRRA was tasked to BU a letter to ASNOD quoting para 3D and dispatch"],["177","NHQ:020/156/93A/VOL.XXXI/18","Administrative instructions for the conduct of 2026 first quarter route march for NN personnel in Abuja area holding at Naval Base Abuja on Saturday 1","Action Officer","ALL","Assigned","2026-04-01","2026-04-05","Nil","","Completed","ON TIME","All to note"],["178","NHQ:020/156/93/A/VOL.XXXI/19","Administrative instructions for the conduct of 2026 first quarter swimming proficiency training test and certification for NN personnel in Abuja area","Action Officer","ALL","Assigned","2026-04-01","2026-04-05","Nil","","Completed","ON TIME","All to note"],["179","NHQ:020/96A/26/SSB/VOL.I/59","Dispostion of officers and ratings serving in NASS Branch","Action Officer","NA-CNASS","Dispatched","2026-03-31","2026-03-31","Nil","","Completed","ON TIME","Dispatched to COA"],["180","NHQ:04/89/12/SSB/VOL.I/186","Request for approval and release of funds for sundry carpentry electrical and plumbering works in NASS branch","Action Officer","MAINT OFFR","Assigned","2026-04-05","2026-04-05","7","2026-04-12","Active","ON TIME","The CNASS tasked the MAINT OFFICER to do a holistic survey of safety defects as observed in the NASS branch for all staff branches and forward same fo"]];
var sortCol=-1,sortAsc=true;
function sc(s){var l=(s||'').toLowerCase();if(l==='active')return 's-active';if(l==='completed')return 's-completed';if(l==='on hold')return 's-hold';if(l==='cancelled')return 's-cancelled';if(l==='filed')return 's-filed';return '';}
function computeFlag(r){var status=(r[10]||'').toLowerCase();if(status==='completed'||status==='filed'||status==='cancelled')return'ON TIME';var due=r[9];if(!due||due.length<8){var sla=parseInt(r[8]);var dmov=r[7]||r[6];if(!isNaN(sla)&&sla>0&&dmov&&dmov.length>=8){var d=new Date(dmov);d.setDate(d.getDate()+sla);due=d.toISOString().split('T')[0];}}if(!due||due.length<8)return'';var today=new Date();today.setHours(0,0,0,0);var dueDate=new Date(due);dueDate.setHours(0,0,0,0);return dueDate<today?'OVERDUE':'ON TIME';}
function calcDueDate(dmov,sla){if(!dmov||dmov.length<8)return'';var s=parseInt(sla);if(isNaN(s)||s<=0)return'';var d=new Date(dmov);d.setDate(d.getDate()+s);return d.toISOString().split('T')[0];}
function updateModalDue(){var dmov=document.getElementById('m-dmov').value;var sla=document.getElementById('m-sla').value;var due=calcDueDate(dmov,sla);if(due)document.getElementById('m-due').value=due;}
function fmtDate(v){if(!v)return'';var p=v.split('-');if(p.length!==3)return v;return p[2]+'/'+p[1]+'/'+p[0];}function mkSel(list,val,cb){var s=document.createElement('select');var b=document.createElement('option');b.value='';b.textContent='—';s.appendChild(b);list.forEach(function(o){var op=document.createElement('option');op.value=o;op.textContent=o;if(o===val)op.selected=true;s.appendChild(op);});if(cb)s.addEventListener('change',cb);return s;}
function mkInp(val,type,cb){var i=document.createElement('input');i.type=type||'text';i.value=val||'';if(cb)i.addEventListener('change',cb);return i;}
var selRows=new Set();
function updateBulkBar(){var bar=document.getElementById('bulk-bar');if(!bar)return;var n=selRows.size;bar.classList.toggle('bulk-bar-open',n>0);var cnt=document.getElementById('bulk-cnt');if(cnt)cnt.textContent=n+' record'+(n===1?'':'s')+' selected';}
function toggleSelAll(v){document.querySelectorAll('.row-chk').forEach(function(c){var ri=+c.dataset.ri;c.checked=v;if(v)selRows.add(ri);else selRows.delete(ri);c.closest('tr').classList.toggle('row-selected',v);});updateBulkBar();}
async function bulkUpdateStatus(){var sel=document.getElementById('bulk-status-sel');if(!sel||!sel.value){showToast('Please choose a status first.','warn');return;return;}var ns=sel.value;selRows.forEach(function(ri){if(rows[ri])rows[ri][10]=ns;});clearSel();await saveData();refresh();showToast(n+' record'+(n===1?'':'s')+' updated.','success');}
function clearSel(){selRows=new Set();updateBulkBar();var ca=document.getElementById('chk-all');if(ca)ca.checked=false;document.querySelectorAll('.row-chk').forEach(function(c){c.checked=false;c.closest('tr').classList.remove('row-selected');});var sel=document.getElementById('bulk-status-sel');if(sel)sel.value='';}
function buildRow(r,vi,ri){var tr=document.createElement('tr');function td(){var x=document.createElement('td');tr.appendChild(x);return x;}var s0=td();var _chk=document.createElement('input');_chk.type='checkbox';_chk.className='row-chk';_chk.dataset.ri=ri;if(selRows.has(ri)){_chk.checked=true;tr.classList.add('row-selected');}_chk.addEventListener('change',(function(_ri,_tr){return function(){if(this.checked){selRows.add(_ri);_tr.classList.add('row-selected');}else{selRows.delete(_ri);_tr.classList.remove('row-selected');}updateBulkBar();};})(ri,tr));s0.appendChild(_chk);s0.appendChild(document.createTextNode('\u00a0'+(vi+1)+'.'));var s1=td();var _hlq=(document.getElementById('srch').value||'').toLowerCase().trim();if(_hlq&&r[1]){s1.innerHTML=_hl(r[1],_hlq);}else{s1.textContent=r[1]||'';}var s2=td();if(_hlq&&r[2]){s2.innerHTML=_hl(r[2],_hlq);}else{s2.textContent=r[2]||'';}s2.addEventListener('click',(function(idx){return function(){openDetail(idx);};})(ri));var s3=td();s3.textContent=r[3]||'';var s4=td();s4.textContent=r[4]||'';var s5=td();s5.textContent=r[5]||'';var s6=td();s6.textContent=fmtDate(r[6]);var s7=td();s7.textContent=fmtDate(r[7]);var s8=td();s8.textContent=r[8]||'';var s9=td();s9.textContent=fmtDate(r[9]);var fl=computeFlag(r);tr.className=sc(r[10])+(fl==='OVERDUE'?' row-overdue':'');var s10=td();if(['editor','superuser'].includes(window.userRole||'viewer')){s10.style.cursor='pointer';s10.title='Click to change status';var _stSp=document.createElement('span');_stSp.textContent=r[10]||'—';_stSp.className='stat-inl';s10.appendChild(_stSp);s10.addEventListener('click',(function(_ri,_r,_sp,_sd){return function(e){e.stopPropagation();if(_sd.querySelector('select'))return;var _old=_r[10];var _sel=mkSel(statuses,_r[10],async function(){if(_sel.value&&_sel.value!==_old){_r[10]=_sel.value;_sp.textContent=_r[10];await saveData();refresh();showToast('Status updated.','success');}while(_sd.firstChild)_sd.removeChild(_sd.firstChild);_sd.appendChild(_sp);});_sel.className='inline-stat-sel';_sel.addEventListener('blur',function(){setTimeout(function(){while(_sd.firstChild)_sd.removeChild(_sd.firstChild);_sd.appendChild(_sp);},150);});while(_sd.firstChild)_sd.removeChild(_sd.firstChild);_sd.appendChild(_sel);_sel.focus();};})(ri,r,_stSp,s10));}else{s10.textContent=r[10]||'';}var s11=td();var _td=new Date();_td.setHours(0,0,0,0);var _dd=r[9]&&r[9].length>=8?new Date(r[9]):null;if(_dd)_dd.setHours(0,0,0,0);var _df=_dd?Math.round((_dd-_td)/86400000):null;var _fin=['completed','filed','cancelled'].includes((r[10]||'').toLowerCase());if(fl==='OVERDUE'&&!_fin&&_df!==null){s11.innerHTML='<span class="cdg-over">'+Math.abs(_df)+' day'+(Math.abs(_df)===1?'':'s')+' overdue</span>';}else if(fl==='ON TIME'&&!_fin&&_df!==null&&_df>=0&&_df<=7){s11.innerHTML='<span class="'+(_df<=3?'cdg-urgent':'cdg-warn')+'">'+_df+' day'+(_df===1?'':'s')+' left</span>';}else{s11.className=fl==='OVERDUE'?'flag-overdue':fl==='ON TIME'?'flag-ontime':'';s11.textContent=fl;}var s12=td();s12.textContent=r[12]||'';var sdel=td();sdel.className='act-cell';var vb=document.createElement('button');vb.className='view-btn';vb.textContent='View';vb.addEventListener('click',(function(idx){return function(){openDetail(idx);};})(ri));sdel.appendChild(vb);var eb=document.createElement('button');eb.className='edit-btn';eb.textContent='Edit';eb.addEventListener('click',(function(idx){return function(){openModal(idx);};})(ri));if(!['editor','superuser'].includes(window.userRole||'viewer'))eb.style.display='none';sdel.appendChild(eb);if(['editor','superuser'].includes(window.userRole||'viewer')){var dupb=document.createElement('button');dupb.className='dup-btn';dupb.title='Duplicate record';dupb.textContent='⎘';dupb.addEventListener('click',(function(_idx){return function(e){e.stopPropagation();duplicateRecord(_idx);};})(ri));sdel.appendChild(dupb);}var db=document.createElement('button');db.className='del';db.title='Delete record';db.innerHTML='<svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="1.5" y1="1.5" x2="9.5" y2="9.5"/><line x1="9.5" y1="1.5" x2="1.5" y2="9.5"/></svg>';db.addEventListener('click',(function(idx){return function(){if(confirm('Delete this record?')){rows.splice(idx,1);saveData();refresh();showToast('Record deleted.','success');}};})(ri));if((window.userRole||'viewer')!=='superuser')db.style.display='none';sdel.appendChild(db);return tr;}
var PAGE_SIZE=10;var currentPage=99999;function renderTable(data){var tb=document.getElementById('tbody');tb.innerHTML='';var totalPages=Math.max(1,Math.ceil(data.length/PAGE_SIZE));if(currentPage>totalPages)currentPage=totalPages;var start=(currentPage-1)*PAGE_SIZE,end=Math.min(start+PAGE_SIZE,data.length);for(var vi=start;vi<end;vi++){tb.appendChild(buildRow(data[vi],vi,rows.indexOf(data[vi])));}document.getElementById('rc').textContent=data.length+' / '+rows.length+' records';renderPager(data.length,totalPages);}function renderPager(total,totalPages){var el=document.getElementById('nass-pager');if(!el)return;if(total<=PAGE_SIZE){el.style.display='none';return;}el.style.display='flex';var html='';html+='<button class="pg-btn pg-arrow"'+( currentPage===1?' disabled':'' )+' onclick="goPage(-1)">&#8592; Prev</button>';var win=10,half=Math.floor(win/2);var lo=Math.max(1,currentPage-half);var hi=Math.min(totalPages,lo+win-1);lo=Math.max(1,hi-win+1);for(var p=lo;p<=hi;p++){var active=(p===currentPage)?' pg-active':'';html+='<button class="pg-btn'+active+'" onclick="jumpPage('+p+')">'+p+'</button>';}html+='<button class="pg-btn pg-arrow"'+( currentPage===totalPages?' disabled':'' )+' onclick="goPage(1)">Next &#8594;</button>';el.innerHTML=html;}function goPage(dir){var data=getFiltered();var totalPages=Math.max(1,Math.ceil(data.length/PAGE_SIZE));currentPage=Math.min(Math.max(currentPage+dir,1),totalPages);renderTable(data);}function jumpPage(p){currentPage=p;renderTable(getFiltered());}
function setStatFilter(fst,fdl){document.getElementById('f-status').value=fst;document.getElementById('f-delay').value=fdl;currentPage=1;applyFilter();}
function renderStats(){var tot=rows.length,act=0,comp=0,od=0,hold=0,canc=0,filed=0;rows.forEach(function(r){var s=(r[10]||'').toLowerCase();if(s==='active')act++;else if(s==='completed')comp++;else if(s==='on hold')hold++;else if(s==='cancelled')canc++;else if(s==='filed')filed++;if(computeFlag(r)==='OVERDUE')od++;});function tile(n,lbl,tcls,ncls,fst,fdl){return'<div class="sc '+tcls+' sc-link" onclick="setStatFilter(\''+fst+'\',\''+fdl+'\')" title="Click to filter by '+lbl+'"><div class="sn '+(ncls||'')+'">'+n+'</div><div class="sl">'+lbl+'</div></div>';}document.getElementById('stats').innerHTML=tile(tot,'Total','','','','')+tile(act,'Active','sc-active','','Active','')+tile(comp,'Completed','sc-completed','g','Completed','')+tile(od,'Overdue','sc-overdue','r','','OVERDUE')+tile(hold,'On Hold','sc-hold','a','On Hold','')+tile(canc,'Cancelled','sc-cancelled','c','Cancelled','')+tile(filed,'Filed','sc-filed','f','Filed','');var _tbd=document.getElementById('tb-dashboard');if(_tbd){var _db=_tbd.querySelector('.tab-badge');if(!_db&&od>0){_db=document.createElement('span');_db.className='tab-badge';_tbd.appendChild(_db);}if(_db){if(od>0){_db.textContent=od;_db.style.display='';}else{_db.style.display='none';}}}}
function getFiltered(){var q=(document.getElementById('srch').value||'').toLowerCase();var fst=document.getElementById('f-status').value;var fof=document.getElementById('f-officer').value;var fdl=document.getElementById('f-delay').value;var _ffrom=(document.getElementById('f-from')||{}).value||'';var _fto=(document.getElementById('f-to')||{}).value||'';var d=rows.filter(function(r){if(q&&!(r[0]+' '+r[1]+' '+r[2]+' '+r[3]+' '+r[4]+' '+r[12]).toLowerCase().includes(q))return false;if(fst&&r[10]!==fst)return false;if(fof&&r[4]!==fof)return false;if(fdl&&computeFlag(r)!==fdl)return false;if(_ffrom&&r[6]&&r[6]<_ffrom)return false;if(_fto&&r[6]&&r[6]>_fto)return false;return true;});if(sortCol>=0)d.sort(function(a,b){var av=a[sortCol]||'',bv=b[sortCol]||'';return sortAsc?av.localeCompare(bv):bv.localeCompare(av);});document.getElementById('fc').textContent=d.length<rows.length?'Showing '+d.length+' of '+rows.length:'';return d;}
function applyFilter(){var _d=getFiltered();currentPage=Math.max(1,Math.ceil(_d.length/PAGE_SIZE));renderTable(_d);}
var _srchDeb=0;function srchFilter(){clearTimeout(_srchDeb);_srchDeb=setTimeout(applyFilter,200);}
function refresh(){renderStats();populateOfficerFilter();applyFilter();_checkOverdueReminder();}function _checkOverdueReminder(){if(sessionStorage.getItem('_od_alerted'))return;var od=rows.filter(function(r){return computeFlag(r)==='OVERDUE';}).length;if(od>0){showToast(od+' document'+(od===1?'':'s')+' overdue — review required.','warn');sessionStorage.setItem('_od_alerted','1');}}
function clearFilter(){document.getElementById('srch').value='';document.getElementById('f-status').value='';document.getElementById('f-officer').value='';document.getElementById('f-delay').value='';var _ff=document.getElementById('f-from');if(_ff)_ff.value='';var _ft=document.getElementById('f-to');if(_ft)_ft.value='';applyFilter();}
function populateOfficerFilter(){var sel=document.getElementById('f-officer'),cur=sel.value;sel.innerHTML='<option value="">All</option>';officers.forEach(function(o){var op=document.createElement('option');op.value=o;op.textContent=o;if(o===cur)op.selected=true;sel.appendChild(op);});}
function doSort(col){var ths=document.querySelectorAll('thead th');if(sortCol===col)sortAsc=!sortAsc;else{sortCol=col;sortAsc=true;}ths.forEach(function(t){t.classList.remove('sa','sd');});ths[col].classList.add(sortAsc?'sa':'sd');applyFilter();}
function fillModalLists(){function pop(id,list){var el=document.getElementById(id);el.innerHTML='<option value="">— Select —</option>';list.forEach(function(v){var o=document.createElement('option');o.value=v;o.textContent=v;el.appendChild(o);});}pop('m-loc',locations);pop('m-off',officers);pop('m-act',actions);pop('m-stat',statuses);var dl=document.getElementById('fi-dl');dl.innerHTML='';fileIndex.forEach(function(v){var o=document.createElement('option');o.value=v;dl.appendChild(o);});}
function setModalMode(mode){var fields=['m-ref','m-subject','m-loc','m-off','m-act','m-drcv','m-dmov','m-sla','m-due','m-stat','m-flag','m-rem'];var disabled=(mode==='view');fields.forEach(function(id){var el=document.getElementById(id);if(el)el.disabled=disabled;});document.getElementById('m-edit-btn').style.display=disabled?'':'none';document.getElementById('m-save-btn').style.display=disabled?'none':'';}function enableModalEdit(){setModalMode('edit');}function openModal(editIdx){if(!['editor','superuser'].includes(window.userRole||'viewer')){alert('Your account does not have permission to add or edit records.\n\nPlease contact the system administrator to upgrade your role.');return;}fillModalLists();var isEdit=(editIdx!=null);document.getElementById('m-idx').value=isEdit?editIdx:'';document.getElementById('mtitle').textContent=isEdit?'Edit Record':'Add New Record';if(isEdit){var r=rows[editIdx];document.getElementById('m-ref').value=r[1];document.getElementById('m-subject').value=r[2];document.getElementById('m-loc').value=r[3];document.getElementById('m-off').value=r[4];document.getElementById('m-act').value=r[5];document.getElementById('m-drcv').value=r[6];document.getElementById('m-dmov').value=r[7];document.getElementById('m-sla').value=r[8];document.getElementById('m-due').value=r[9];document.getElementById('m-stat').value=r[10];document.getElementById('m-flag').value=computeFlag(r);document.getElementById('m-rem').value=r[12];setModalMode('edit');}else{['m-ref','m-subject','m-sla','m-rem'].forEach(function(id){document.getElementById(id).value='';});document.getElementById('m-drcv').value=new Date().toISOString().slice(0,10);document.getElementById('m-dmov').value='';document.getElementById('m-due').value='';document.getElementById('m-stat').value='Active';document.getElementById('m-flag').value='ON TIME';document.getElementById('m-loc').value='';document.getElementById('m-off').value='';document.getElementById('m-act').value='';setModalMode('edit');}document.getElementById('mbg').classList.add('open');}
function closeModal(){document.getElementById('mbg').classList.remove('open');}var currentDetailIdx=null;function openDetail(idx){var r=rows[idx];currentDetailIdx=idx;document.getElementById('d-ref').textContent=r[1]||'—';var _dsub=document.getElementById('d-subject');_dsub.textContent=r[2]||'—';_dsub.removeAttribute('href');_dsub.classList.remove('detail-subject-linked');document.getElementById('d-serial').textContent=(getFiltered().indexOf(r)+1)+'.';document.getElementById('d-off').textContent=r[4]||'—';document.getElementById('d-loc').textContent=r[3]||'—';document.getElementById('d-act').textContent=r[5]||'—';document.getElementById('d-drcv').textContent=fmtDate(r[6])||'—';document.getElementById('d-dmov').textContent=fmtDate(r[7])||'—';document.getElementById('d-due').textContent=fmtDate(r[9])||'—';document.getElementById('d-sla').textContent=r[8]||'—';document.getElementById('d-rem').textContent=r[12]||'—';var st=r[10]||'';var dsSt=document.getElementById('d-status');dsSt.textContent=st;dsSt.className='detail-status '+(st==='Active'?'ds-active':st==='Completed'?'ds-completed':st==='On Hold'?'ds-hold':st==='Cancelled'?'ds-cancelled':st==='Filed'?'ds-filed':'');var fl=computeFlag(r)||r[11]||'';var dsFl=document.getElementById('d-flag');dsFl.textContent=fl;dsFl.className='detail-flag '+(fl==='OVERDUE'?'df-overdue':fl==='ON TIME'?'df-ontime':'');var auditBy=document.getElementById('d-updated-by');if(auditBy)auditBy.textContent=r[13]||'—';var auditAt=document.getElementById('d-updated-at');if(auditAt){var ad=r[14]?new Date(r[14]):null;auditAt.textContent=ad?ad.toLocaleString('en-GB',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}):'—';}document.getElementById('detail-mbg').classList.add('open');gdriveSearchForRecord(r[2],r[1]);loadRecordHistory(idx);}
function saveModal(){if(!['editor','superuser'].includes(window.userRole||'viewer'))return;var r=['',document.getElementById('m-ref').value.trim(),document.getElementById('m-subject').value.trim(),document.getElementById('m-loc').value,document.getElementById('m-off').value,document.getElementById('m-act').value,document.getElementById('m-drcv').value,document.getElementById('m-dmov').value,document.getElementById('m-sla').value.trim(),document.getElementById('m-due').value,document.getElementById('m-stat').value,'',document.getElementById('m-rem').value.trim()];if(!r[9]){var auto=calcDueDate(r[7],r[8]);if(auto)r[9]=auto;}r[11]=computeFlag(r);var _newRef=(r[1]||'').trim().toLowerCase();if(_newRef){var _ei2=document.getElementById('m-idx').value!==''?parseInt(document.getElementById('m-idx').value):-1;var _dupIdx=rows.findIndex(function(row,_i){return _i!==_ei2&&(row[1]||'').trim().toLowerCase()===_newRef;});if(_dupIdx>=0&&!confirm('⚠ File Ref "'+r[1]+'" already exists at serial #'+(_dupIdx+1)+'.\n\nSave as a new entry anyway?'))return;}var idx=document.getElementById('m-idx').value;if(idx!=='')rows[parseInt(idx)]=r;else rows.push(r);saveData();closeModal();refresh();showToast('Record saved successfully.','success');}
var _fiPage=0;function renderAdmin(){function draw(list,cid){var el=document.getElementById(cid);el.innerHTML='';list.forEach(function(item,i){var t=document.createElement('span');t.className='tag';t.textContent=item+' ';var x=document.createElement('button');x.className='tx';x.textContent='×';x.addEventListener('click',(function(idx){return function(){if(confirm('Remove "'+list[idx]+'"?')){list.splice(idx,1);renderAdmin();refresh();}};})(i));t.appendChild(x);el.appendChild(t);});}draw(officers,'at-officers');(function(){var FP=10;var e2=document.getElementById('at-fileIndex');e2.innerHTML='';var st=_fiPage*FP;fileIndex.slice(st,st+FP).forEach(function(item,pi){var ri=st+pi;var t=document.createElement('span');t.className='tag';t.textContent=item+' ';var x=document.createElement('button');x.className='tx';x.textContent='×';x.addEventListener('click',(function(idx){return function(){if(confirm('Remove "'+fileIndex[idx]+'"?')){fileIndex.splice(idx,1);if(_fiPage>0&&_fiPage*FP>=fileIndex.length)_fiPage--;renderAdmin();refresh();}};})(ri));t.appendChild(x);e2.appendChild(t);});var tp=Math.ceil(fileIndex.length/FP);if(tp>1){var pc=document.createElement('div');pc.className='fi-pg';var prevDis=(_fiPage===0)?'disabled':'';var nextDis=(_fiPage>=tp-1)?'disabled':'';pc.innerHTML='<button class="fi-pgb" '+prevDis+' onclick="_fiPage--;renderAdmin()">‹</button>'+'<span class="fi-pgn">'+(_fiPage+1)+' / '+tp+'</span>'+'<button class="fi-pgb" '+nextDis+' onclick="_fiPage++;renderAdmin()">›</button>';e2.appendChild(pc);}})();draw(statuses,'at-statuses');draw(locations,'at-locations');draw(actions,'at-actions');}
function showAI(w){document.getElementById('ai-'+w).style.display='flex';document.getElementById('av-'+w).focus();}
function hideAI(w){document.getElementById('ai-'+w).style.display='none';document.getElementById('av-'+w).value='';}
function saveAI(w){var v=document.getElementById('av-'+w).value.trim();if(!v)return;var L=w==='officers'?officers:w==='fileIndex'?fileIndex:w==='statuses'?statuses:w==='locations'?locations:actions;if(!L.includes(v))L.push(v);saveData();hideAI(w);renderAdmin();refresh();}
function showView(v){if((v==='admin'||v==='users')&&(window.userRole||'viewer')!=='superuser')return;if(v==='audit'&&!['editor','superuser'].includes(window.userRole||'viewer'))return;var tbi=document.getElementById('tb-inbox');if(tbi)tbi.classList.toggle('on',v==='inbox');document.getElementById('tb-tracker').classList.toggle('on',v==='tracker');var tbd=document.getElementById('tb-dashboard');if(tbd)tbd.classList.toggle('on',v==='dashboard');document.getElementById('tb-admin').classList.toggle('on',v==='admin');var tbu=document.getElementById('tb-users');if(tbu)tbu.classList.toggle('on',v==='users');var tba=document.getElementById('tb-audit');if(tba)tba.classList.toggle('on',v==='audit');var tbk=document.getElementById('tb-kanban');if(tbk)tbk.classList.toggle('on',v==='kanban');document.getElementById('view-tracker').style.display=v==='tracker'?'block':'none';var vd=document.getElementById('view-dashboard');if(vd)vd.style.display=v==='dashboard'?'block':'none';document.getElementById('view-admin').style.display=v==='admin'?'flex':'none';var vu=document.getElementById('view-users');if(vu)vu.style.display=v==='users'?'block':'none';var va=document.getElementById('view-audit');if(va)va.style.display=v==='audit'?'block':'none';var vi=document.getElementById('view-inbox');if(vi)vi.style.display=v==='inbox'?'block':'none';var vk=document.getElementById('view-kanban');if(vk)vk.style.display=v==='kanban'?'block':'none';if(v==='admin'){renderAdmin();loadMappings();}if(v==='users')loadUsersPanel();if(v==='dashboard'){renderDashboard();var _db=document.querySelector('#tb-dashboard .tab-badge');if(_db)_db.style.display='none';}if(v==='audit')loadAuditLog(1);if(v==='kanban')renderKanban();if(v==='inbox')loadInbox();}
// ── Dashboard ─────────────────────────────────────────────────────
var _chartJsLoaded=false;
function renderDashboard(){
  if(!_chartJsLoaded){
    var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js';
    s.onload=function(){_chartJsLoaded=true;_drawCharts();};
    document.head.appendChild(s);
  }else{_drawCharts();}
}
function _esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function _hl(text,q){if(!q)return _esc(text);var esc=_esc(text);var re=new RegExp('('+q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi');return esc.replace(re,'<mark class="srch-hl">$1</mark>');}
function _drawCharts(){
  // ── Tally ─────────────────────────────────────────────────────
  var sc={Active:0,Completed:0,'On Hold':0,Cancelled:0,Filed:0};
  var overdue=0,officers={};
  rows.forEach(function(r){
    var s=r[10]||'';if(sc[s]!==undefined)sc[s]++;
    if(computeFlag(r)==='OVERDUE')overdue++;
    if((r[10]||'').toLowerCase()==='active'&&r[4])officers[r[4]]=(officers[r[4]]||0)+1;
  });
  // ── Summary tiles ─────────────────────────────────────────────
  var sr=document.getElementById('db-stats-row');
  if(sr)sr.innerHTML=[
    ['Total',    rows.length,          'db-t-total', '',           "clearFilter();showView('tracker')"],
    ['Active',   sc.Active,            'db-t-active','sc-active',  "setStatFilter('Active','');showView('tracker')"],
    ['Overdue',  overdue,              'db-t-over',  'sc-overdue', "setStatFilter('','OVERDUE');showView('tracker')"],
    ['Completed',sc.Completed,         'db-t-comp',  'sc-completed',"setStatFilter('Completed','');showView('tracker')"],
    ['On Hold',  sc['On Hold'],        'db-t-hold',  'sc-hold',    "setStatFilter('On Hold','');showView('tracker')"],
    ['Filed',    sc.Filed,             'db-t-filed', 'sc-filed',   "setStatFilter('Filed','');showView('tracker')"]
  ].map(function(t){return'<div class="db-tile db-tile-link '+t[2]+' '+t[3]+'" onclick="'+t[4]+'" title="View in Tracker"><div class="db-tile-n">'+t[1]+'</div><div class="db-tile-l">'+t[0]+'</div></div>';}).join('');
  // ── Donut chart (Status breakdown) ────────────────────────────
  var dCtx=document.getElementById('db-donut');if(!dCtx)return;
  if(window._dbDon)window._dbDon.destroy();
  window._dbDon=new Chart(dCtx,{type:'doughnut',data:{
    labels:['Active','Completed','On Hold','Cancelled','Filed'],
    datasets:[{data:[sc.Active,sc.Completed,sc['On Hold'],sc.Cancelled,sc.Filed],
      backgroundColor:['#0055aa','#1a7a3c','#c8a400','#b81c2e','#5a2d9a'],
      borderWidth:3,borderColor:'#fff',hoverOffset:6}]
  },options:{responsive:true,maintainAspectRatio:false,cutout:'62%',
    plugins:{legend:{position:'right',labels:{font:{size:12},padding:16,usePointStyle:true}},
      tooltip:{callbacks:{label:function(c){var v=c.parsed;var tot=c.dataset.data.reduce(function(a,b){return a+b;},0);return' '+v+' ('+Math.round(v/tot*100)+'%)';}}}}}});
  // ── Bar chart (Officer workload) ──────────────────────────────
  var bCtx=document.getElementById('db-bar');if(!bCtx)return;
  var sortedOff=Object.keys(officers).sort(function(a,b){return officers[b]-officers[a];}).slice(0,12);
  if(window._dbBar)window._dbBar.destroy();
  window._dbBar=new Chart(bCtx,{type:'bar',data:{
    labels:sortedOff,
    datasets:[{label:'Active records',data:sortedOff.map(function(o){return officers[o];}),
      backgroundColor:'rgba(0,85,170,0.82)',borderRadius:5,borderSkipped:false}]
  },options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,
    plugins:{legend:{display:false}},
    scales:{x:{grid:{color:'#e8eaf0'},ticks:{stepSize:1,font:{size:11}}},
            y:{grid:{display:false},ticks:{font:{size:11}}}}}});
  // ── Overdue table (paginated) ─────────────────────────────────
  _odRows=rows.filter(function(r){return computeFlag(r)==='OVERDUE';});
  _odPage=1;renderOdPage();
}
var _odRows=[],_odPage=1,_odPageSize=10;
function renderOdPage(){
  var ol=document.getElementById('db-overdue-list');if(!ol)return;
  if(!_odRows.length){ol.innerHTML='<div class="dh-empty">No overdue records \u2714\ufe0f</div>';return;}
  var tot=_odRows.length,totalPages=Math.max(1,Math.ceil(tot/_odPageSize));
  _odPage=Math.min(Math.max(_odPage,1),totalPages);
  var start=(_odPage-1)*_odPageSize,slice=_odRows.slice(start,start+_odPageSize);
  var tbody=slice.map(function(r){
    var d=r[9]&&r[9].length>=8?new Date(r[9]):null;
    var days=d?Math.max(0,Math.round((new Date()-d)/86400000)):'—';
    var ri=rows.indexOf(r);
    return'<tr class="db-od-row" onclick="showView(\'tracker\');openDetail('+ri+')" title="Open record"><td>'+_esc(r[1])+'</td><td>'+_esc(r[2].length>60?r[2].slice(0,60)+'\u2026':r[2])+'</td><td>'+_esc(r[4])+'</td><td>'+fmtDate(r[9])+'</td><td><span class="cdg-over">'+days+'d</span></td></tr>';
  }).join('');
  var pager='';
  if(totalPages>1){
    var btns='';
    var lo=Math.max(1,_odPage-2),hi=Math.min(totalPages,lo+4);lo=Math.max(1,hi-4);
    if(lo>1)btns+='<button class="db-pg-btn" onclick="goOdPage(1)">1</button>'+(lo>2?'<span class="db-pg-gap">\u2026</span>':'');
    for(var p=lo;p<=hi;p++)btns+='<button class="db-pg-btn'+(p===_odPage?' db-pg-active':'')+'" onclick="goOdPage('+p+')">'+p+'</button>';
    if(hi<totalPages)btns+=(hi<totalPages-1?'<span class="db-pg-gap">\u2026</span>':'')+'<button class="db-pg-btn" onclick="goOdPage('+totalPages+')">'+totalPages+'</button>';
    pager='<div class="db-pager"><button class="db-pg-btn db-pg-arrow" onclick="goOdPage('+(_odPage-1)+')"'+(_odPage===1?' disabled':'')+'>&#8592;</button>'+btns+'<button class="db-pg-btn db-pg-arrow" onclick="goOdPage('+(_odPage+1)+')"'+(_odPage===totalPages?' disabled':'')+'>&#8594;</button><span class="db-pg-info">'+start+1+'\u2013'+Math.min(start+_odPageSize,tot)+' of '+tot+'</span></div>';
  }
  ol.innerHTML='<table class="db-od-tbl"><thead><tr><th>File Ref</th><th>Subject</th><th>Officer</th><th>Due Date</th><th>Days Over</th></tr></thead><tbody>'+tbody+'</tbody></table>'+pager;
}
function goOdPage(p){_odPage=p;renderOdPage();}
// ── Record Change History ─────────────────────────────────────────
async function loadRecordHistory(ri){
  var list=document.getElementById('d-history-list');if(!list)return;
  var uid=window.rowIds&&window.rowIds[ri];
  if(!uid){list.innerHTML='<div class="dh-empty">Not yet synced to server — save once to enable history.</div>';return;}
  list.innerHTML='<div class="dh-empty">Loading…</div>';
  try{
    var res=await window._sb.from('nass_audit').select('*').eq('record_id',uid).order('changed_at',{ascending:false}).limit(25);
    if(res.error)throw res.error;
    var data=res.data||[];
    if(!data.length){list.innerHTML='<div class="dh-empty">No changes recorded yet.</div>';return;}
    var labels={created:'Record created',status:'Status changed',location:'Location changed',officer:'Officer changed',action:'Last action changed',updated:'Details updated'};
    list.innerHTML=data.map(function(h){
      var d=new Date(h.changed_at);
      var when=d.toLocaleString('en-GB',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});
      var lbl=labels[h.action]||h.action;
      var chg=(h.old_val||h.new_val)?'<span class="dh-old">'+_esc(h.old_val||'—')+'</span><span class="dh-arr">\u2192</span><span class="dh-new">'+_esc(h.new_val||'—')+'</span>':'';
      return'<div class="dh-item"><div class="dh-meta"><span class="dh-who">'+_esc(h.user_email||'—')+'</span><span class="dh-when">'+when+'</span></div><div class="dh-what">'+lbl+chg+'</div></div>';
    }).join('');
  }catch(e){list.innerHTML='<div class="dh-empty">Could not load history.</div>';}
}
function exportCSV(){var h=['#','Serial','File Ref No.','Subject','Current Location','Action Officer','Last Action','Date Received','Date Moved','SLA (Days)','Due Date','Status','Delay Flag','Remarks'];var _exp=getFiltered();var lines=[h.join(',')];_exp.forEach(function(r,i){lines.push([i+1].concat(r.map(function(v){return '"'+(v||'').replace(/"/g,"''")+'"';})).join(','));});var csv='\uFEFF'+lines.join('\n');var a=document.createElement('a');a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv);a.download='NASS_Branch_WorkflowTracker_2026.csv';a.click();}

// ── Inbox ──────────────────────────────────────────────────────────
var _inboxLastSeen=null,_inboxDocs=[],_inboxPage=0,_inboxPPG=10;
async function loadInbox(){
  var el=document.getElementById('inbox-list');
  var sub=document.getElementById('inbox-sub');
  if(!el)return;
  el.innerHTML='<div class="gm-loading">Loading…</div>';
  try{
    var uid=(window.userSession&&window.userSession.user&&window.userSession.user.id)||'';
    var mRes=await window._sb.from('nass_officer_mappings').select('officer_name').eq('user_id',uid);
    if(mRes.error)throw mRes.error;
    var myOfficers=(mRes.data||[]).map(function(m){return m.officer_name;});
    if(!myOfficers.length){
      el.innerHTML='<div class="gm-empty">No officer mapping found.<br><small>Ask your admin to map your account to an officer name.</small></div>';
      if(sub)sub.textContent='No officer assigned to your account';
      _gmUpdateToolbar(0,0);return;
    }
    var seenRes=await window._sb.from('nass_inbox_seen').select('last_seen_at').eq('user_id',uid).maybeSingle();
    _inboxLastSeen=seenRes.data?new Date(seenRes.data.last_seen_at):new Date(0);
    var rRes=await window._sb.from('nass_records').select('*').in('officer',myOfficers).order('updated_at',{ascending:false}).limit(200);
    if(rRes.error)throw rRes.error;
    _inboxDocs=rRes.data||[];
    _inboxPage=0;
    if(!_inboxDocs.length){
      el.innerHTML='<div class="gm-empty">No documents assigned to you.</div>';
      if(sub)sub.textContent='Officer: '+myOfficers.join(', ');
      _gmUpdateToolbar(0,0);return;
    }
    var unread=_inboxDocs.filter(function(d){return new Date(d.updated_at||d.created_at)>_inboxLastSeen;}).length;
    if(sub)sub.textContent='Officer: '+myOfficers.join(', ');
    var uct=document.getElementById('gm-unread-ct');
    if(uct){uct.textContent=unread?String(unread):'';uct.style.display=unread?'':'none';}
    _renderInboxPage();
    markInboxSeen();
    updateInboxBadge(0);
  }catch(e){
    console.error('[Inbox]',e);
    el.innerHTML='<div class="gm-empty">Could not load inbox. Check connection.</div>';
  }
}
function _renderInboxPage(){
  var el=document.getElementById('inbox-list');
  if(!el)return;
  var total=_inboxDocs.length;
  var start=_inboxPage*_inboxPPG;
  var page=_inboxDocs.slice(start,start+_inboxPPG);
  _gmUpdateToolbar(start,total);
  el.innerHTML='';
  var tbl=document.createElement('table');
  tbl.className='gm-tbl';
  page.forEach(function(d){
    var isNew=new Date(d.updated_at||d.created_at)>_inboxLastSeen;
    var fl=d.delay_flag||'';
    var statusCls=d.status==='Active'?'ds-active':d.status==='Completed'?'ds-completed':d.status==='On Hold'?'ds-hold':d.status==='Cancelled'?'ds-cancelled':d.status==='Filed'?'ds-filed':'';
    var flagCls=fl==='OVERDUE'?'flag-overdue':fl==='ON TIME'?'flag-ontime':'';
    var dt=new Date(d.updated_at||d.created_at||0);
    var now=new Date();
    var sameDay=dt.getFullYear()===now.getFullYear()&&dt.getMonth()===now.getMonth()&&dt.getDate()===now.getDate();
    var dateStr=sameDay?dt.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}):dt.toLocaleDateString('en-GB',{day:'2-digit',month:'short'});
    var tr=document.createElement('tr');
    tr.className='gm-row'+(isNew?' gm-unread':'');
    tr.innerHTML=
      '<td class="gm-td-chk"><input type="checkbox" class="gm-row-chk" onclick="event.stopPropagation();this.closest(\'tr\').classList.toggle(\'gm-selected\',this.checked)"></td>'+
      '<td class="gm-td-dot">'+(isNew?'<span class="gm-dot"></span>':'')+'</td>'+
      '<td class="gm-td-from">'+_esc(d.officer||'\u2014')+'</td>'+
      '<td class="gm-td-subj">'+
        '<span class="gm-subj-main">'+_esc((d.subject||'').substring(0,90))+'</span>'+
        '<span class="gm-subj-ref"> \u2014 '+_esc(d.file_ref||'')+'</span>'+
      '</td>'+
      '<td class="gm-td-badges">'+
        (d.status?'<span class="detail-status '+statusCls+'">'+_esc(d.status)+'</span>':'')+
        (fl&&flagCls?'<span class="inbox-flag '+flagCls+'">'+_esc(fl)+'</span>':'')+
      '</td>'+
      '<td class="gm-td-date">'+_esc(dateStr)+'</td>';
    tr.addEventListener('click',function(e){
      if(e.target.type==='checkbox')return;
      var idx=rows.findIndex(function(r){return (r[1]||'')===(d.file_ref||'');});
      if(idx>=0){showView('tracker');openDetail(idx);}
      else showView('tracker');
    });
    tbl.appendChild(tr);
  });
  el.appendChild(tbl);
}
function _gmUpdateToolbar(start,total){
  var info=document.getElementById('gm-pg-info');
  var prev=document.getElementById('gm-prev-btn');
  var next=document.getElementById('gm-next-btn');
  var sa=document.getElementById('gm-sel-all');
  if(info)info.textContent=total?(start+1)+'\u2013'+Math.min(start+_inboxPPG,total)+' of '+total:'No messages';
  if(prev)prev.disabled=_inboxPage===0;
  if(next)next.disabled=(start+_inboxPPG)>=total;
  if(sa)sa.checked=false;
}
window._gmSelAll=function(checked){document.querySelectorAll('.gm-row-chk').forEach(function(c){c.checked=checked;c.closest('tr').classList.toggle('gm-selected',checked);});};
window._gmPrev=function(){if(_inboxPage>0){_inboxPage--;_renderInboxPage();}};
window._gmNext=function(){if((_inboxPage+1)*_inboxPPG<_inboxDocs.length){_inboxPage++;_renderInboxPage();}};
async function markInboxSeen(){
  try{
    var uid=(window.userSession&&window.userSession.user&&window.userSession.user.id)||'';
    if(!uid)return;
    await window._sb.from('nass_inbox_seen').upsert({user_id:uid,last_seen_at:new Date().toISOString()},{onConflict:'user_id'});
  }catch(e){}
}
function updateInboxBadge(count){
  var b=document.getElementById('inbox-badge');
  if(!b)return;
  if(count>0){b.textContent=count>9?'9+':String(count);b.style.display='';}
  else{b.style.display='none';}
}
async function checkInboxUnread(){
  try{
    var uid=(window.userSession&&window.userSession.user&&window.userSession.user.id)||'';
    if(!uid)return;
    var mRes=await window._sb.from('nass_officer_mappings').select('officer_name').eq('user_id',uid);
    if(mRes.error||!mRes.data||!mRes.data.length)return;
    var myOfficers=mRes.data.map(function(m){return m.officer_name;});
    var seenRes=await window._sb.from('nass_inbox_seen').select('last_seen_at').eq('user_id',uid).maybeSingle();
    var lastSeen=seenRes.data?new Date(seenRes.data.last_seen_at):new Date(0);
    var rRes=await window._sb.from('nass_records').select('id,updated_at,created_at').in('officer',myOfficers).gt('updated_at',lastSeen.toISOString());
    var count=(rRes.data||[]).length;
    updateInboxBadge(count);
    var tbi=document.getElementById('tb-inbox');
    if(tbi)tbi.style.display='';
  }catch(e){}
}

// ── Officer Mapping (admin) ────────────────────────────────────────
var _mappings=[];
var _allUsers=[];
async function loadMappings(){
  var el=document.getElementById('mapping-list');
  if(!el)return;
  el.innerHTML='<div style="color:var(--fg-subtle);font-size:12px">Loading…</div>';
  try{
    var [mRes,uRes]=await Promise.all([
      window._sb.from('nass_officer_mappings').select('*').order('officer_name'),
      window._sb.from('nass_profiles').select('user_id,email,role').order('email')
    ]);
    _mappings=(mRes.data||[]);
    _allUsers=(uRes.data||[]);
    renderMappings();
  }catch(e){
    el.innerHTML='<div style="color:var(--signal-danger);font-size:12px">Failed to load mappings.</div>';
  }
}
function renderMappings(){
  var el=document.getElementById('mapping-list');
  if(!el)return;
  var html='<table class="map-tbl"><thead><tr><th>Officer Name</th><th>Assigned User</th><th></th></tr></thead><tbody>';
  officers.forEach(function(off){
    var cur=_mappings.find(function(m){return m.officer_name===off;});
    var curUserId=cur?cur.user_id:'';
    html+='<tr><td class="map-off">'+_esc(off)+'</td><td>';
    html+='<select class="map-sel" data-off="'+_esc(off)+'"><option value="">— Unassigned —</option>';
    _allUsers.forEach(function(u){
      html+='<option value="'+_esc(u.user_id)+'"'+(u.user_id===curUserId?' selected':'')+'>'+_esc((u.email||'').split('@')[0])+' ('+_esc(u.email||'')+')</option>';
    });
    html+='</select></td><td>';
    if(cur)html+='<button class="btn-map-clear" data-off="'+_esc(off)+'" title="Remove mapping">&times;</button>';
    html+='</td></tr>';
  });
  html+='</tbody></table>';
  html+='<button class="btn btn-navy" style="margin-top:14px" onclick="saveMappings()">&#128190; Save Mappings</button>';
  el.innerHTML=html;
  el.querySelectorAll('.btn-map-clear').forEach(function(btn){
    btn.addEventListener('click',async function(){
      var off=this.dataset.off;
      await window._sb.from('nass_officer_mappings').delete().eq('officer_name',off);
      await loadMappings();
      showToast('Mapping removed for '+off,'success');
    });
  });
}
async function saveMappings(){
  var sels=document.querySelectorAll('.map-sel');
  var toUpsert=[],toDelete=[];
  sels.forEach(function(sel){
    var off=sel.dataset.off;
    var uid=sel.value;
    var userObj=_allUsers.find(function(u){return u.user_id===uid;});
    if(uid&&userObj){
      toUpsert.push({officer_name:off,user_id:uid,user_email:userObj.email});
    }else{
      toDelete.push(off);
    }
  });
  try{
    if(toUpsert.length)await window._sb.from('nass_officer_mappings').upsert(toUpsert,{onConflict:'officer_name'});
    if(toDelete.length)await window._sb.from('nass_officer_mappings').delete().in('officer_name',toDelete);
    _mappings=toUpsert;
    showToast('Mappings saved successfully.','success');
    await loadMappings();
  }catch(e){
    showToast('Failed to save mappings: '+e.message,'error');
  }
}

function applyRolePermissions(){var r=window.userRole||'viewer';var isSU=r==='superuser';var isEd=r==='editor'||isSU;if(!isEd){document.querySelectorAll('[onclick="openModal()"]').forEach(function(b){b.style.display='none';});var exp=document.querySelector('[onclick="exportCSV()"]');if(exp)exp.style.display='none';}document.getElementById('tb-admin').style.display=isSU?'':'none';var tbu=document.getElementById('tb-users');if(tbu)tbu.style.display=isSU?'':'none';var tba=document.getElementById('tb-audit');if(tba)tba.style.display=isEd?'':'none';var tbk2=document.getElementById('tb-kanban');if(tbk2)tbk2.style.display=isEd?'':'none';if(!isEd){var dem=document.querySelector('#detail-mbg .mok');if(dem)dem.style.display='none';}var tbi2=document.getElementById('tb-inbox');if(tbi2)tbi2.style.display='';var rb=document.getElementById('nass-user-role-badge');if(rb){rb.textContent=r.charAt(0).toUpperCase()+r.slice(1);rb.style.display='inline-block';}}
var MU_URL='https://sblqmpmawkogbbzzkwxt.supabase.co/functions/v1/manage-users';
async function _muReq(method,body){var s=(await window._sb.auth.getSession()).data.session;var o={method:method,headers:{Authorization:'Bearer '+s.access_token,'Content-Type':'application/json'}};if(body)o.body=JSON.stringify(body);var resp=await fetch(MU_URL,o);var d=await resp.json().catch(function(){return{};});if(!resp.ok)throw new Error(d.error||'Request failed ('+resp.status+')');return d;}
async function loadUsersPanel(){var el=document.getElementById('u-list-body');if(!el)return;el.innerHTML='<tr><td colspan="4" style="text-align:center;padding:24px;color:#888">Loading…</td></tr>';try{var data=await _muReq('GET');el.innerHTML='';if(!data.length){el.innerHTML='<tr><td colspan="4" style="text-align:center;padding:24px;color:#888">No users found.</td></tr>';return;}var delSvg='<svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="1.5" y1="1.5" x2="9.5" y2="9.5"/><line x1="9.5" y1="1.5" x2="1.5" y2="9.5"/></svg>';data.forEach(function(u){var isSelf=(window.userSession&&u.user_id===window.userSession.user.id);var roles=['superuser','editor','viewer'];var selHtml='<select class="u-role-sel"'+(isSelf?' disabled':'')+' onchange="updateUserRole(\''+u.user_id+'\',this.value)">'+roles.map(function(rv){return'<option value="'+rv+'"'+(rv===u.role?' selected':'')+'>'+rv.charAt(0).toUpperCase()+rv.slice(1)+'</option>';}).join('')+'</select>';var tr=document.createElement('tr');tr.innerHTML='<td style="display:flex;align-items:center"><span class="u-avatar">'+u.email[0].toUpperCase()+'</span><span>'+u.email+(isSelf?' <span class="u-you">(you)</span>':'')+'</span></td><td><span class="role-badge role-'+u.role+'">'+u.role+'</span></td><td>'+selHtml+'</td><td style="text-align:center">'+(isSelf?'<span style="color:var(--fg-faint);font-size:12px">—</span>':'<button class="del" title="Remove user" onclick="removeUser(\''+u.user_id+'\',\''+u.email+'\')">'+delSvg+'</button>')+'</td>';el.appendChild(tr);});}catch(e){el.innerHTML='<tr><td colspan="4" style="color:var(--signal-danger);padding:14px">Error: '+e.message+'</td></tr>';}}
async function inviteUser(){var email=(document.getElementById('u-invite-email').value||'').trim();var role=document.getElementById('u-invite-role').value;var msg=document.getElementById('u-invite-msg');if(!email){msg.className='u-msg u-msg-err';msg.textContent='Please enter an email address.';return;}msg.className='u-msg';msg.textContent='Creating account…';try{var res=await _muReq('POST',{action:'invite',email:email,role:role});document.getElementById('u-invite-email').value='';await loadUsersPanel();if(res.temp_password){msg.className='u-msg u-msg-ok';msg.innerHTML='✓ Account created for <strong>'+email+'</strong>. Share the temporary password below — it must be changed on first login.<div class="u-temp-pw-box"><span class="u-temp-pw" id="u-tmp-pw-val">'+res.temp_password+'</span><button class="btn btn-navy" style="font-size:11px;padding:3px 10px;margin-left:8px" onclick="var t=document.getElementById(\'u-tmp-pw-val\');navigator.clipboard.writeText(t.textContent).then(function(){var b=this;}).catch(function(){});this.textContent=\'Copied!\';setTimeout(function(){var b=document.querySelector(\'.u-temp-pw-box .btn\');if(b)b.textContent=\'Copy\';},2000)">Copy</button></div>';}else{msg.className='u-msg u-msg-ok';msg.textContent='✓ Account created for '+email;}}catch(e){msg.className='u-msg u-msg-err';msg.textContent='Error: '+e.message;}}
async function updateUserRole(uid,role){try{await _muReq('POST',{action:'update-role',user_id:uid,role:role});loadUsersPanel();}catch(e){showToast('Could not update role: '+e.message,'error');loadUsersPanel();}}
async function removeUser(uid,email){if(!confirm('Permanently remove '+email+'?\nThis cannot be undone.'))return;try{await _muReq('POST',{action:'delete',user_id:uid});loadUsersPanel();}catch(e){showToast('Could not remove user: '+e.message,'error');}}
// ── Column Visibility ─────────────────────────────────────────
var COL_VIS_DEFS=[
  {n:'File Ref No.',c:2,def:true},{n:'Location',c:4,def:true},{n:'Officer',c:5,def:true},
  {n:'Last Action',c:6,def:true},{n:'Date Received',c:7,def:true},{n:'Date Moved',c:8,def:false},
  {n:'SLA',c:9,def:true},{n:'Due Date',c:10,def:true},{n:'Status',c:11,def:true},
  {n:'Delay / Countdown',c:12,def:true},{n:'Remarks',c:13,def:true}
];
var colVisState={};
function loadColVis(){var sv=localStorage.getItem('nassColVis');if(sv){try{colVisState=JSON.parse(sv);}catch(e){}}COL_VIS_DEFS.forEach(function(d){if(colVisState[d.c]===undefined)colVisState[d.c]=d.def;});}
function saveColVis(){localStorage.setItem('nassColVis',JSON.stringify(colVisState));}
function applyColVis(){var tbl=document.querySelector('.tw table');if(!tbl)return;COL_VIS_DEFS.forEach(function(d){tbl.classList.toggle('hide-col-'+d.c,!colVisState[d.c]);});}
function toggleColItem(c,v){colVisState[c]=v;saveColVis();applyColVis();}
function renderColVisPop(){var pop=document.getElementById('col-vis-pop');if(!pop)return;pop.innerHTML='<div class="cvp-title">Show / Hide Columns</div>';COL_VIS_DEFS.forEach(function(d){var lbl=document.createElement('label');lbl.className='cvp-row';var cb=document.createElement('input');cb.type='checkbox';cb.checked=!!colVisState[d.c];cb.addEventListener('change',(function(col){return function(){toggleColItem(col,this.checked);};})(d.c));lbl.appendChild(cb);lbl.appendChild(document.createTextNode('\u00a0'+d.n));pop.appendChild(lbl);});}
function toggleColVisPop(){var pop=document.getElementById('col-vis-pop');if(!pop)return;var open=pop.classList.toggle('cvp-open');if(open)renderColVisPop();}
document.addEventListener('click',function(e){var pop=document.getElementById('col-vis-pop');var btn=document.getElementById('col-vis-btn');if(pop&&pop.classList.contains('cvp-open')&&!pop.contains(e.target)&&e.target!==btn)pop.classList.remove('cvp-open');});
loadData();populateOfficerFilter();renderStats();renderTable(rows);loadColVis();applyColVis();
document.getElementById('mbg').addEventListener('click',function(e){if(e.target===this)closeModal();});

// ── Google Drive PDF Integration ──────────────────────────────
var GDRIVE_CLIENT_ID='1073280029907-0166ddlukbg2mg6mprp6hlk34l9fsj5a.apps.googleusercontent.com';
var GDRIVE_FOLDER_ID='1aIq34zv9PNbV--h7xPC1r_p8_uZ6VjSk'; // Documents/2026 CNASS OUTGOING SCANNED DOCUMENTS
var _gTok=null,_gTC=null,_gTCb=null;

// ── Token client ──
function _gclient(){
  if(_gTC)return _gTC;
  if(!window.google||!window.google.accounts)return null;
  _gTC=google.accounts.oauth2.initTokenClient({
    client_id:GDRIVE_CLIENT_ID,
    scope:'https://www.googleapis.com/auth/drive.readonly',
    prompt:'',
    callback:function(r){if(r.access_token){_gTok=r.access_token;if(_gTCb){var c=_gTCb;_gTCb=null;c();}}}
  });
  return _gTC;
}
function _gwithToken(cb){
  if(_gTok){cb();return;}
  var tc=_gclient();
  if(!tc){console.warn('[Drive] GIS not ready');return;}
  _gTCb=cb;
  tc.requestAccessToken({prompt:''});
}

// ── Stop words to ignore when picking search terms ──
var _gStop=new Set(['that','this','with','from','have','will','been','were','they','their','which','when','what','where','also','more','into','some','than','then','there','these','those','after','about','other','your','each','such','over','both','during','before','between','should','could','would','shall','must','being','having','making','taking','request','order','ensure','conduct','first','second','third','within','under','above','following','regard','subject','letter','dated','naval','headquarters','branch','navy','nigerian','officer','command','approval','international','assessment','assessments','establishment','establishments','infrastructure','environmental','management','conference','compliance','standardisation','production','presentation','inspection','invitation','attend','place','work','safety','report','executive','evaluation','annual','facilities','office','purchase','senior','retired','exercise','general','quarter','systems','standard','standards','equipment','items','funds','review','summary','activities','information','operations','random','hazards','joint','video','audit','ships']);

// ── Pick the N most distinctive words from a text ──
// Returns [{w, acronym}] — acronym=true when word was uppercase in a mixed-case subject.
function _gDistinct(text,n){
  var raw=text||'';
  var upCt=(raw.match(/[A-Z]/g)||[]).length;
  var loCt=(raw.match(/[a-z]/g)||[]).length;
  var allCaps=upCt>loCt*2;
  var seen=new Set(),words=[];
  function add(w,acr){if(w.length>2&&!_gStop.has(w)&&!seen.has(w)){seen.add(w);words.push({w:w,acronym:acr});}}
  if(!allCaps){
    (raw.match(/\b[A-Z]{2,}\b/g)||[]).forEach(function(w){add(w.toLowerCase(),true);});
    raw.toLowerCase().replace(/[^a-z0-9\s]/g,' ').split(/\s+/)
      .filter(function(w){return w.length>4;}).forEach(function(w){add(w,false);});
  }else{
    raw.toLowerCase().replace(/[^a-z0-9\s]/g,' ').split(/\s+/)
      .filter(function(w){return w.length>4;})
      .sort(function(a,b){return b.length-a.length;})
      .forEach(function(w){add(w,false);});
  }
  return words.slice(0,n);
}

// ── Score a filename against a subject (0–1) ──
// True acronyms (uppercase in mixed-case text) get 2.5x weight bonus — highly specific.
function _gScore(subject,filename){
  var terms=_gDistinct(subject,10);
  var fname=filename.toLowerCase().replace(/\.pdf$/i,'').replace(/[^a-z0-9\s]/g,' ');
  if(!terms.length)return 0;
  var score=0,maxPossible=0;
  terms.forEach(function(t){
    var boost=t.acronym?2.5:1.0;
    var wt=t.w.length*boost;
    maxPossible+=wt;
    if(fname.includes(t.w))score+=wt;
    else if(fname.includes(t.w.slice(0,5)))score+=wt*0.4;
  });
  return maxPossible>0?score/maxPossible:0;
}

// ── Fetch candidates from Drive using targeted keyword queries ──
async function _gCandidates(subject, fileref){
  var subjectWords=_gDistinct(subject,3).map(function(t){return t.w;}); // extract .w from {w,acronym} objects
  // also pull any alphanumeric chunk from the file ref (e.g. "020278", "291537")
  var refChunks=(fileref||'').match(/[A-Z0-9]{4,}/gi)||[];
  refChunks=refChunks.slice(0,2).map(function(s){return s.toLowerCase();});

  var queries=subjectWords.concat(refChunks).slice(0,4);
  if(!queries.length)return[];

  console.log('[Drive] Querying with terms:',queries);
  var seen=new Map();
  for(var i=0;i<queries.length;i++){
    var kw=queries[i].replace(/'/g,'');
    // Search the whole accessible drive with fullText (recursive, finds PDFs in subfolders)
    // Folder constraint dropped because PDFs live in subfolders, not directly in parent
    var qFull="mimeType='application/pdf' and trashed=false and fullText contains '"+kw+"'";
    var qName="mimeType='application/pdf' and trashed=false and name contains '"+kw+"'";
    try{
      for(var qi=0;qi<2;qi++){
        var q2=qi===0?qFull:qName;
        var res=await fetch('https://www.googleapis.com/drive/v3/files?q='+encodeURIComponent(q2)+'&fields=files(id,name,webViewLink)&pageSize=20&supportsAllDrives=true&includeItemsFromAllDrives=true',{headers:{'Authorization':'Bearer '+_gTok}});
        if(res.status===401){_gTok=null;return null;}
        var d=await res.json();
        (d.files||[]).forEach(function(f){seen.set(f.id,f);});
        if(seen.size>0)break; // fullText found results, skip name query
      }
    }catch(e){console.warn('[Drive] Query error:',e);}
  }
  return Array.from(seen.values());
}

// ── One-time folder reachability check ──
var _gFolderChecked=false;
async function _gCheckFolder(){
  if(_gFolderChecked)return;
  _gFolderChecked=true;
  // Probe: list immediate children (may be subfolders) and any PDFs directly inside
  var q=encodeURIComponent("'"+GDRIVE_FOLDER_ID+"' in parents and trashed=false");
  var res=await fetch('https://www.googleapis.com/drive/v3/files?q='+q+'&fields=files(id,name,mimeType)&pageSize=10&supportsAllDrives=true&includeItemsFromAllDrives=true',{headers:{'Authorization':'Bearer '+_gTok}});
  var d=await res.json();
  console.log('[Drive] Folder children (',res.status,'):');
  (d.files||[]).forEach(function(f,i){console.log('  ['+i+']',f.mimeType==='application/vnd.google-apps.folder'?'[FOLDER]':'[FILE]',f.name);});
  if(d.error)console.error('[Drive] Probe error:',d.error);
}

// ── Find best matching PDF ──
async function _gsearch(subject, fileref){
  await _gCheckFolder();
  var candidates=await _gCandidates(subject, fileref);
  if(!candidates||!candidates.length){
    console.log('[Drive] No candidates found for:',subject.substring(0,60));
    return null;
  }
  var best=null,bestScore=0,THRESHOLD=0.08;
  candidates.forEach(function(f){
    var s=_gScore(subject,f.name);
    if(s>bestScore){bestScore=s;best=f;}
  });
  console.log('[Drive] Candidates:',candidates.length,' Best:',best?best.name:'none',' Score:',bestScore.toFixed(3));
  return bestScore>=THRESHOLD?best:null;
}

// ── UI orchestration ──
function gdriveSearchForRecord(subject, fileref){
  var panel=document.getElementById('d-pdf-panel');
  var loading=document.getElementById('d-pdf-loading');
  var frame=document.getElementById('d-pdf-frame');
  var titleEl=document.getElementById('d-pdf-title');
  var openLink=document.getElementById('d-pdf-open');
  var mbox=document.querySelector('.detail-mbox');
  if(!panel)return;
  panel.style.display='flex';
  if(loading)loading.style.display='flex';
  if(frame){frame.src='';frame.style.display='none';}
  if(titleEl)titleEl.textContent='';
  if(mbox)mbox.classList.add('detail-has-pdf');
  _gwithToken(async function(){
    var file=await _gsearch(subject, fileref);
    if(loading)loading.style.display='none';
    var subjectEl=document.getElementById('d-subject');
    if(file){
      if(titleEl)titleEl.textContent=file.name.replace(/\.pdf$/i,'');
      var wvl=file.webViewLink||'#';
      if(openLink)openLink.href=wvl;
      if(subjectEl){subjectEl.href=wvl;subjectEl.classList.add('detail-subject-linked');}
      if(frame){frame.src='https://drive.google.com/file/d/'+file.id+'/preview';frame.style.display='block';}
    }else{
      panel.style.display='none';
      if(mbox)mbox.classList.remove('detail-has-pdf');
      if(subjectEl){subjectEl.removeAttribute('href');subjectEl.classList.remove('detail-subject-linked');}
    }
  });
}

// ── Activity Log ──────────────────────────────────────────────────
var _alPage=1,_alPageSize=25;
async function loadAuditLog(p){
  _alPage=p||1;
  var tbody=document.getElementById('al-tbody');
  if(!tbody)return;
  tbody.innerHTML='<tr><td colspan="5" style="text-align:center;padding:28px;color:#888">Loading…</td></tr>';
  try{
    var fUser=(document.getElementById('al-filter-user')||{}).value||'';
    var fAct=(document.getElementById('al-filter-action')||{}).value||'';
    var q=window._sb.from('nass_audit')
      .select('*,nass_records(file_ref,subject)',{count:'exact'})
      .order('changed_at',{ascending:false})
      .range((_alPage-1)*_alPageSize,_alPage*_alPageSize-1);
    if(fUser)q=q.ilike('user_email','%'+fUser+'%');
    if(fAct)q=q.eq('action',fAct);
    var res=await q;
    var data=res.data,error=res.error,count=res.count;
    if(error)throw error;
    tbody.innerHTML='';
    if(!data||data.length===0){tbody.innerHTML='<tr><td colspan="5" style="text-align:center;padding:28px;color:#888">No activity found.</td></tr>';return;}
    var actionLabels={created:'New Record',status:'Status',location:'Location',officer:'Officer',action:'Last Action',remarks:'Remarks',updated:'Updated'};
    data.forEach(function(h){
      var when=h.changed_at?new Date(h.changed_at).toLocaleString('en-GB',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}):'—';
      var rec=h.nass_records;
      var recTxt=rec?(_esc(rec.file_ref||'?')+(rec.subject?' — '+_esc((rec.subject||'').slice(0,60)):'')):_esc(h.record_id||'—');
      var lbl=actionLabels[h.action]||h.action||'—';
      var badgeCls='al-lbl-'+(h.action||'other');
      var chg=h.action==='created'?'<span class="dh-new">Record created</span>':'<span class="dh-old">'+_esc(h.old_val||'—')+'</span><span class="dh-arr"> → </span><span class="dh-new">'+_esc(h.new_val||'—')+'</span>';
      var tr=document.createElement('tr');
      tr.innerHTML='<td class="al-td-ts">'+when+'</td><td class="al-td">'+_esc(h.user_email||'—')+'</td><td class="al-td"><span class="al-lbl '+badgeCls+'">'+_esc(lbl)+'</span></td><td class="al-td al-td-rec" title="'+_esc(recTxt)+'">'+recTxt.slice(0,80)+(recTxt.length>80?'…':'')+'</td><td class="al-td"><span class="dh-what">'+chg+'</span></td>';
      tbody.appendChild(tr);
    });
    var total=count||0;var pages=Math.max(1,Math.ceil(total/_alPageSize));
    var pg=document.getElementById('al-pager');
    if(pg){
      var ph='<span class="db-pg-info">'+total+' entr'+(total===1?'y':'ies')+'</span>';
      if(pages>1){
        ph='<button class="db-pg-btn db-pg-arrow"'+(_alPage===1?' disabled':'')+' onclick="loadAuditLog('+(_alPage-1)+')">&#8592;</button>';
        for(var pi=1;pi<=pages;pi++){if(pi===1||pi===pages||Math.abs(pi-_alPage)<=2){ph+='<button class="db-pg-btn'+(pi===_alPage?' db-pg-active':'')+'" onclick="loadAuditLog('+pi+')">'+pi+'</button>';}else if(Math.abs(pi-_alPage)===3){ph+='<span class="db-pg-gap">…</span>';}}
        ph+='<button class="db-pg-btn db-pg-arrow"'+(_alPage===pages?' disabled':'')+' onclick="loadAuditLog('+(_alPage+1)+')">&#8594;</button>';
        ph+='<span class="db-pg-info" style="margin-left:8px">'+total+' entr'+(total===1?'y':'ies')+'</span>';
      }
      pg.innerHTML=ph;
    }
  }catch(e){var tb=document.getElementById('al-tbody');if(tb)tb.innerHTML='<tr><td colspan="5" style="color:var(--signal-danger);padding:14px">Error loading activity log: '+_esc(e.message)+'</td></tr>';}
}

// ── Kanban Board ──────────────────────────────────────────────────
function renderKanban(){
  var board=document.getElementById('kb-board');
  if(!board)return;
  var lanes=['Active','On Hold','Completed','Filed','Cancelled'];
  var laneClrs={'Active':'#0055aa','On Hold':'#c8a400','Completed':'#1a7a3c','Filed':'#5a2d9a','Cancelled':'#b81c2e'};
  board.innerHTML='';
  var isEd=['editor','superuser'].includes(window.userRole||'viewer');
  lanes.forEach(function(status){
    var recs=rows.map(function(r,i){return{r:r,i:i};}).filter(function(x){return x.r[10]===status;});
    var col=document.createElement('div');col.className='kb-col';
    var head=document.createElement('div');head.className='kb-col-head';
    head.style.borderBottomColor=laneClrs[status]||'#ccc';
    head.innerHTML='<span class="kb-col-title">'+_esc(status)+'</span><span class="kb-col-cnt">'+recs.length+'</span>';
    col.appendChild(head);
    var body=document.createElement('div');body.className='kb-col-body';
    if(!recs.length){var emp=document.createElement('div');emp.className='kb-empty';emp.textContent='No records';body.appendChild(emp);}
    recs.forEach(function(x){
      var r=x.r,ri=x.i;
      var fl=computeFlag(r);
      var isOver=fl==='OVERDUE'&&!['Completed','Filed','Cancelled'].includes(r[10]||'');
      var _td2=new Date();_td2.setHours(0,0,0,0);
      var _dd2=r[9]&&r[9].length>=8?new Date(r[9]):null;if(_dd2)_dd2.setHours(0,0,0,0);
      var dLeft=_dd2?Math.round((_dd2-_td2)/86400000):null;
      var card=document.createElement('div');card.className='kb-card'+(isOver?' kb-overdue':'');
      var refEl=document.createElement('div');refEl.className='kb-card-ref';refEl.textContent=r[1]||'—';
      refEl.onclick=(function(idx){return function(){openDetail(idx);};})(ri);card.appendChild(refEl);
      var subEl=document.createElement('div');subEl.className='kb-card-sub';
      subEl.textContent=(r[2]||'').slice(0,90)+((r[2]||'').length>90?'…':'');
      subEl.onclick=(function(idx){return function(){openDetail(idx);};})(ri);card.appendChild(subEl);
      var metaEl=document.createElement('div');metaEl.className='kb-card-meta';
      var offSpan=document.createElement('span');offSpan.className='kb-card-officer';offSpan.textContent=r[4]||'—';metaEl.appendChild(offSpan);
      if(isOver&&dLeft!==null){var b=document.createElement('span');b.className='cdg-over';b.textContent=Math.abs(dLeft)+'d over';metaEl.appendChild(b);}
      else if(fl==='ON TIME'&&dLeft!==null&&dLeft>=0&&dLeft<=7){var b=document.createElement('span');b.className=dLeft<=3?'cdg-urgent':'cdg-warn';b.textContent=dLeft+'d left';metaEl.appendChild(b);}
      card.appendChild(metaEl);
      var footEl=document.createElement('div');footEl.className='kb-card-foot';
      var viewBtn=document.createElement('button');viewBtn.className='kb-view-btn';viewBtn.textContent='View';
      viewBtn.onclick=(function(idx){return function(){openDetail(idx);};})(ri);footEl.appendChild(viewBtn);
      if(isEd){
        var sel=mkSel(statuses,r[10],async function(){if(sel.value&&sel.value!==r[10]){r[10]=sel.value;await saveData();renderKanban();renderStats();}});
        sel.className='kb-status-sel';footEl.appendChild(sel);
      }
      card.appendChild(footEl);body.appendChild(card);
    });
    col.appendChild(body);board.appendChild(col);
  });
}

// ── Keyboard Shortcuts ────────────────────────────────────────────
document.addEventListener('keydown',function(e){
  var tag=(e.target.tagName||'').toLowerCase();
  if(tag==='input'||tag==='textarea'||tag==='select')return;
  if(e.ctrlKey||e.metaKey||e.altKey)return;
  switch(e.key){
    case 'n':case 'N':e.preventDefault();openModal();break;
    case '/':e.preventDefault();var _s=document.getElementById('srch');if(_s){showView('tracker');setTimeout(function(){_s.focus();},50);}break;
    case 'Escape':
      if(document.getElementById('mbg').classList.contains('open'))closeModal();
      else if(document.getElementById('detail-mbg').classList.contains('open')){document.getElementById('detail-mbg').classList.remove('open');if(typeof resetPdfExpand==='function')resetPdfExpand();}
      else{var _sh=document.getElementById('shortcuts-help');if(_sh)_sh.remove();}
      break;
    case 'p':case 'P':e.preventDefault();window.print();break;
    case '?':toggleShortcutsHelp();break;
    case '1':showView('tracker');break;
    case '2':showView('dashboard');break;
    case '3':showView('kanban');break;
    case '4':showView('dashboard');break;
  }
});
function toggleShortcutsHelp(){
  var ex=document.getElementById('shortcuts-help');if(ex){ex.remove();return;}
  var el=document.createElement('div');el.id='shortcuts-help';el.className='shortcuts-help';
  var pairs=[['N','New record'],['/','Focus search'],['1','Tracker'],['2','Dashboard'],['3','Kanban'],['P','Print'],['Esc','Close modal'],['?','This help']];
  el.innerHTML='<div class="sh-title">Keyboard Shortcuts<button class="sh-close" onclick="document.getElementById(\'shortcuts-help\').remove()">&#10005;</button></div>'+
    pairs.map(function(p){return'<div class="sh-row"><kbd>'+p[0]+'</kbd><span>'+p[1]+'</span></div>';}).join('');
  document.body.appendChild(el);
  setTimeout(function(){document.addEventListener('click',function fn(e){if(!el.contains(e.target)){el.remove();document.removeEventListener('click',fn);}});},80);
}

// ── Formal Report Export ──────────────────────────────────────────
function exportReport(){
  var data=getFiltered();
  var now=new Date();
  var dateStr=now.toLocaleDateString('en-GB',{day:'2-digit',month:'long',year:'numeric'});
  var timeStr=now.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
  var act=0,comp=0,hold=0,od=0,filed=0;
  data.forEach(function(r){var s=(r[10]||'').toLowerCase();if(s==='active')act++;else if(s==='completed')comp++;else if(s==='on hold')hold++;else if(s==='filed')filed++;if(computeFlag(r)==='OVERDUE')od++;});
  var tblRows=data.map(function(r,i){
    var fl=computeFlag(r);
    var stClr=r[10]==='Completed'?'#1a7a3c':r[10]==='Active'?'#0055aa':r[10]==='On Hold'?'#8a6000':r[10]==='Cancelled'?'#b81c2e':'#5a2d9a';
    var flClr=fl==='OVERDUE'?'#b81c2e':'#1a7a3c';
    return'<tr><td>'+(i+1)+'</td><td>'+_esc(r[1]||'')+'</td><td>'+_esc(r[2]||'')+'</td><td>'+_esc(r[3]||'')+'</td><td>'+_esc(r[4]||'')+'</td><td>'+_esc(fmtDate(r[6]))+'</td><td>'+_esc(fmtDate(r[9]))+'</td><td style="font-weight:700;color:'+stClr+'">'+_esc(r[10]||'')+'</td><td style="font-weight:700;color:'+flClr+'">'+_esc(fl)+'</td><td>'+_esc(r[12]||'')+'</td></tr>';
  }).join('');
  var isFiltered=data.length<rows.length;
  var subtitle=isFiltered?'FILTERED RECORDS ('+data.length+' of '+rows.length+')':'ALL RECORDS ('+rows.length+')';
  var html='<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>NASS Branch Report</title><style>'+
    'body{font-family:Arial,sans-serif;font-size:10pt;color:#000;margin:0;padding:0}'+
    '.page{padding:2cm 2.2cm}'+
    '.hdr{text-align:center;border-bottom:3px solid #002655;padding-bottom:14px;margin-bottom:18px}'+
    '.hdr-org{font-size:11pt;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#002655;margin-bottom:2px}'+
    '.hdr-title{font-size:16pt;font-weight:800;color:#002655;margin:6px 0 3px}'+
    '.hdr-sub{font-size:9pt;color:#555;text-transform:uppercase;letter-spacing:.06em}'+
    '.meta-row{display:flex;justify-content:space-between;font-size:9pt;color:#444;margin:10px 0 18px;border-top:1px solid #ccc;border-bottom:1px solid #ccc;padding:6px 0}'+
    '.stats-row{display:flex;gap:0;margin-bottom:20px;border:1px solid #ccc;border-radius:4px;overflow:hidden}'+
    '.stat{flex:1;text-align:center;padding:10px 6px;border-right:1px solid #ccc}'+
    '.stat:last-child{border-right:none}'+
    '.stat-n{font-size:20pt;font-weight:800;color:#002655;line-height:1}'+
    '.stat-l{font-size:7.5pt;text-transform:uppercase;letter-spacing:.06em;color:#666;margin-top:3px}'+
    'table{width:100%;border-collapse:collapse;font-size:8.5pt}'+
    'thead th{background:#002655;color:#fff;padding:5pt 5pt;text-align:left;font-size:8pt;font-weight:700;border:1pt solid #001a44}'+
    'tbody td{padding:4pt 5pt;border:0.5pt solid #ccd;vertical-align:top}'+
    'tbody tr:nth-child(even) td{background:#f4f6fa}'+
    '.footer{margin-top:20px;text-align:center;font-size:8pt;color:#888;border-top:1px solid #ccc;padding-top:8px}'+
    '.cls-unclass{display:inline-block;padding:2px 14px;border:2px solid #1a7a3c;color:#1a7a3c;font-weight:800;font-size:9pt;letter-spacing:.1em}'+
    '@media print{.page{padding:1cm 1.5cm}@page{margin:.8cm;size:landscape}}'+
  '</style></head><body><div class="page">'+
    '<div class="hdr">'+
      '<div class="hdr-org">Nigerian Navy &mdash; Naval Headquarters, Abuja</div>'+
      '<div class="hdr-title">NASS BRANCH DOCUMENT WORKFLOW TRACKER</div>'+
      '<div class="hdr-sub">'+subtitle+'</div>'+
      '<div style="margin-top:8px"><span class="cls-unclass">UNCLASSIFIED</span></div>'+
    '</div>'+
    '<div class="meta-row"><span><strong>Date Generated:</strong> '+dateStr+' at '+timeStr+'</span><span><strong>Generated by:</strong> '+_esc((window.userSession&&window.userSession.user.email)||'NASS Tracker')+'</span></div>'+
    '<div class="stats-row">'+
      '<div class="stat"><div class="stat-n">'+data.length+'</div><div class="stat-l">Total Shown</div></div>'+
      '<div class="stat"><div class="stat-n" style="color:#0055aa">'+act+'</div><div class="stat-l">Active</div></div>'+
      '<div class="stat"><div class="stat-n" style="color:#1a7a3c">'+comp+'</div><div class="stat-l">Completed</div></div>'+
      '<div class="stat"><div class="stat-n" style="color:#b81c2e">'+od+'</div><div class="stat-l">Overdue</div></div>'+
      '<div class="stat"><div class="stat-n" style="color:#c8a400">'+hold+'</div><div class="stat-l">On Hold</div></div>'+
      '<div class="stat"><div class="stat-n" style="color:#5a2d9a">'+filed+'</div><div class="stat-l">Filed</div></div>'+
    '</div>'+
    '<table><thead><tr><th style="width:28pt">#</th><th style="width:90pt">File Ref No.</th><th>Subject / Description</th><th style="width:70pt">Location</th><th style="width:55pt">Officer</th><th style="width:50pt">Date Rcvd</th><th style="width:50pt">Due Date</th><th style="width:55pt">Status</th><th style="width:45pt">Delay</th><th>Remarks</th></tr></thead>'+
    '<tbody>'+tblRows+'</tbody></table>'+
    '<div class="footer">NASS Branch Document Workflow Tracker &nbsp;&bull;&nbsp; Naval Headquarters, Abuja &nbsp;&bull;&nbsp; Generated '+dateStr+'</div>'+
  '</div></body></html>';
  var win=window.open('','_blank','width=1000,height=720');
  if(!win){showToast('Please allow pop-ups to generate the print report.','warn');return;}
  win.document.write(html);win.document.close();win.focus();
  setTimeout(function(){win.print();},900);
}

// ── Record Duplication ────────────────────────────────────────────
function duplicateRecord(idx){if(!['editor','superuser'].includes(window.userRole||'viewer'))return;var src=rows[idx];fillModalLists();document.getElementById('m-idx').value='';document.getElementById('mtitle').textContent='Duplicate Record';document.getElementById('m-ref').value='';document.getElementById('m-subject').value=src[2]||'';document.getElementById('m-loc').value=src[3]||'';document.getElementById('m-off').value=src[4]||'';document.getElementById('m-act').value=src[5]||'';document.getElementById('m-drcv').value=new Date().toISOString().slice(0,10);document.getElementById('m-dmov').value='';document.getElementById('m-sla').value=src[8]||'';document.getElementById('m-due').value='';document.getElementById('m-stat').value=src[10]||'Active';document.getElementById('m-flag').value='';document.getElementById('m-rem').value=src[12]||'';setModalMode('edit');document.getElementById('mbg').classList.add('open');}

// ── Dark Mode ─────────────────────────────────────────────────────
function toggleDarkMode(){var on=document.body.classList.toggle('dark');localStorage.setItem('nassDark',on?'1':'0');var b=document.getElementById('dm-btn');if(b){b.title=on?'Switch to light mode':'Switch to dark mode';b.textContent=on?'\u2600':'\u263e';}}
(function(){var on=localStorage.getItem('nassDark')==='1';if(on){document.body.classList.add('dark');var b=document.getElementById('dm-btn');if(b){b.title='Switch to light mode';b.textContent='\u2600';}}})();
