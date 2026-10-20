import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main()=>runApp(const HigienizaPro());
const bg=Color(0xFF07111F),blue=Color(0xFF39A9FF),aqua=Color(0xFF50E3C2),muted=Color(0xFF9EB0C5);
class HigienizaPro extends StatelessWidget{const HigienizaPro({super.key});@override Widget build(BuildContext c)=>MaterialApp(title:'HigienizaPro',debugShowCheckedModeBanner:false,theme:ThemeData(brightness:Brightness.dark,scaffoldBackgroundColor:bg,colorScheme:const ColorScheme.dark(primary:blue,secondary:aqua),useMaterial3:true),home:const Shell());}
class Shell extends StatefulWidget{const Shell({super.key});@override State<Shell> createState()=>_ShellState();}
class _ShellState extends State<Shell> {
  int tab = 0;
  final records = <Record>[];

  @override
  void initState() {
    super.initState();
    _loadRecords();
  }

  Future<void> _loadRecords() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getString('higienizapro_records_v1');
      if (raw != null) {
        final items = jsonDecode(raw) as List<dynamic>;
        records.addAll(items.map((e) => Record.fromJson(Map<String, dynamic>.from(e as Map))));
      }
    } catch (_) {
      // Dados antigos ou inválidos não devem impedir a abertura do app.
    }
    if (mounted) setState(() {});
  }

  Future<void> _persistRecords() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('higienizapro_records_v1', jsonEncode(records.map((r) => r.toJson()).toList()));
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Não foi possível salvar no aparelho.')),
        );
      }
    }
  }

  void _saveRecord(Record record) {
    setState(() {
      records.insert(0, record);
      tab = 3;
    });
    _persistRecords();
  }

  void _deleteRecord(Record record) {
    setState(() => records.remove(record));
    _persistRecords();
  }

  @override
  Widget build(BuildContext context) {
    final pages = <Widget>[
      Home(scan: () => setState(() => tab = 1), count: records.length),
      Scanner(save: _saveRecord),
      const Products(),
      Services(records: records, delete: _deleteRecord),
      const Profile(),
    ];
    return Scaffold(
      extendBody: true,
      body: Stack(children: [
        const Positioned.fill(child: Atmosphere()),
        SafeArea(child: IndexedStack(index: tab, children: pages)),
      ]),
      bottomNavigationBar: SafeArea(
        top: false,
        child: Container(
          margin: const EdgeInsets.fromLTRB(12, 0, 12, 8),
          decoration: BoxDecoration(
            color: const Color(0xF20B1727),
            borderRadius: BorderRadius.circular(22),
            border: Border.all(color: Colors.white12),
          ),
          child: NavigationBar(
            height: 68,
            backgroundColor: Colors.transparent,
            selectedIndex: tab,
            onDestinationSelected: (value) => setState(() => tab = value),
            destinations: const [
              NavigationDestination(icon: Icon(Icons.home_outlined), label: 'Início'),
              NavigationDestination(icon: Icon(Icons.document_scanner_outlined), label: 'Scanner'),
              NavigationDestination(icon: Icon(Icons.science_outlined), label: 'Produtos'),
              NavigationDestination(icon: Icon(Icons.assignment_outlined), label: 'Serviços'),
              NavigationDestination(icon: Icon(Icons.person_outline), label: 'Perfil'),
            ],
          ),
        ),
      ),
    );
  }
}
class Atmosphere extends StatefulWidget{const Atmosphere({super.key});@override State<Atmosphere> createState()=>_AtmosphereState();}
class _AtmosphereState extends State<Atmosphere> with SingleTickerProviderStateMixin{late final a=AnimationController(vsync:this,duration:const Duration(seconds:22))..repeat();@override void dispose(){a.dispose();super.dispose();}@override Widget build(BuildContext c)=>AnimatedBuilder(animation:a,builder:(_,__)=>CustomPaint(painter:Glow(a.value),child:const SizedBox.expand()));}
class Glow extends CustomPainter{final double t;Glow(this.t);@override void paint(Canvas c,Size s){final r=Offset.zero&s;c.drawRect(r,Paint()..shader=const LinearGradient(colors:[Color(0xFF07111F),Color(0xFF0A1B2E),Color(0xFF07111F)]).createShader(r));final p=Paint()..maskFilter=const MaskFilter.blur(BlurStyle.normal,65);c.drawCircle(Offset(s.width*.9,s.height*.1),100,p..color=blue.withValues(alpha:.09));c.drawCircle(Offset(s.width*.03,s.height*.65),110,p..color=aqua.withValues(alpha:.04));final d=Paint()..color=blue.withValues(alpha:.17);for(var i=0;i<22;i++){c.drawCircle(Offset((i*81.3)%s.width,((i*113-t*s.height*.2+s.height)%s.height)),1.2+(i%3)*.4,d);}}@override bool shouldRepaint(covariant Glow o)=>o.t!=t;}
class Frame extends StatelessWidget{final String label,title,desc;final Widget child;const Frame({super.key,required this.label,required this.title,required this.desc,required this.child});@override Widget build(BuildContext c)=>CustomScrollView(slivers:[SliverPadding(padding:const EdgeInsets.fromLTRB(20,20,20,115),sliver:SliverList(delegate:SliverChildListDelegate([Text(label.toUpperCase(),style:const TextStyle(color:aqua,letterSpacing:2,fontSize:10,fontWeight:FontWeight.bold)),const SizedBox(height:7),Text(title,style:const TextStyle(fontSize:29,height:1.12,fontWeight:FontWeight.w800)),const SizedBox(height:9),Text(desc,style:const TextStyle(color:muted,fontSize:13,height:1.5)),const SizedBox(height:20),child])))]);}
class Panel extends StatelessWidget{final Widget child;const Panel({super.key,required this.child});@override Widget build(BuildContext c)=>Container(width:double.infinity,padding:const EdgeInsets.all(17),decoration:BoxDecoration(gradient:const LinearGradient(colors:[Color(0xFF142942),Color(0xDD0D1A2A)]),borderRadius:BorderRadius.circular(22),border:Border.all(color:Colors.white.withValues(alpha:.07))),child:child);}
class Home extends StatelessWidget{final VoidCallback scan;final int count;const Home({super.key,required this.scan,required this.count});@override Widget build(BuildContext c)=>Frame(label:'Higienização inteligente',title:'Cuidado profissional.\nDecisões mais seguras.',desc:'Organize avaliações, consulte informações técnicas e registre seus serviços.',child:Column(children:[Panel(child:Column(crossAxisAlignment:CrossAxisAlignment.start,children:[const Icon(Icons.center_focus_strong,color:aqua,size:36),const SizedBox(height:15),const Text('Scanner de estofados',style:TextStyle(fontSize:20,fontWeight:FontWeight.w800)),const SizedBox(height:8),const Text('Registre uma foto e responda perguntas para organizar uma avaliação inicial.',style:TextStyle(color:muted,height:1.5)),const SizedBox(height:16),SizedBox(width:double.infinity,child:FilledButton.icon(onPressed:scan,icon:const Icon(Icons.camera_alt_outlined),label:const Text('INICIAR AVALIAÇÃO')))])),const SizedBox(height:12),Panel(child:Row(children:[const Icon(Icons.assignment_outlined,color:aqua),const SizedBox(width:12),Expanded(child:Text('Serviços registrados no aparelho: $count')),const Icon(Icons.arrow_forward_ios,size:14,color:muted)])),const SizedBox(height:12),const Panel(child:Text('Importante: uma foto não confirma a composição da fibra nem diagnostica mofo. Recomendações químicas exigem documentação confiável da variante e da superfície.',style:TextStyle(color:muted,height:1.5,fontSize:12)))]));}
class Scanner extends StatefulWidget{final ValueChanged<Record> save;const Scanner({super.key,required this.save});@override State<Scanner> createState()=>_ScannerState();}
class _ScannerState extends State<Scanner>{final picker=ImagePicker();XFile? photo;String surface='Sofá',issue='Sujidade geral',prior='Não sei / nenhum';final notes=TextEditingController();bool report=false;Future<void> pick(ImageSource s)async{try{final x=await picker.pickImage(source:s,imageQuality:88,maxWidth:1800);if (x != null && mounted) { setState(() { photo = x; report = false; }); }}catch(_){if (mounted) { ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Não foi possível abrir a imagem. Confira as permissões.'))); }}}
@override void dispose(){notes.dispose();super.dispose();}@override Widget build(BuildContext c)=>Frame(label:'Avaliação inicial',title:'Scanner',desc:'Registre a superfície e o contexto antes de escolher um tratamento.',child:Column(crossAxisAlignment:CrossAxisAlignment.start,children:[Panel(child:Column(children:[Container(height:180,width:double.infinity,decoration:BoxDecoration(color:Colors.white.withValues(alpha:.03),borderRadius:BorderRadius.circular(16)),child:photo==null?const Column(mainAxisAlignment:MainAxisAlignment.center,children:[Icon(Icons.add_a_photo_outlined,color:blue,size:40),SizedBox(height:10),Text('Adicione uma foto nítida'),Text('Boa iluminação • foco na superfície',style:TextStyle(color:muted,fontSize:11))]):Image.file(File(photo!.path),fit:BoxFit.cover,errorBuilder:(_,__,___)=>const Center(child:Text('Foto selecionada')))),const SizedBox(height:12),Row(children:[Expanded(child:OutlinedButton(onPressed:()=>pick(ImageSource.camera),child:const Text('Câmera'))),const SizedBox(width:8),Expanded(child:OutlinedButton(onPressed:()=>pick(ImageSource.gallery),child:const Text('Galeria')))])])),const SizedBox(height:15),const Text('Superfície'),const SizedBox(height:6),DropdownButtonFormField<String>(initialValue:surface,items:['Sofá','Colchão','Poltrona','Cadeira estofada','Banco automotivo','Teto automotivo','Carpete / tapete','Outro'].map((x)=>DropdownMenuItem(value:x,child:Text(x))).toList(),onChanged:(x)=>setState(()=>surface=x??surface)),const SizedBox(height:12),const Text('Problema observado'),const SizedBox(height:6),DropdownButtonFormField<String>(initialValue:issue,items:['Sujidade geral','Alimento/bebida','Mancha oleosa','Odor','Origem desconhecida','Possível umidade','Outro'].map((x)=>DropdownMenuItem(value:x,child:Text(x))).toList(),onChanged:(x)=>setState(()=>issue=x??issue)),const SizedBox(height:12),const Text('Produto aplicado antes'),const SizedBox(height:6),DropdownButtonFormField<String>(initialValue:prior,items:['Não sei / nenhum','Detergente','Desengraxante','Removedor de manchas','Desinfetante','Outro produto'].map((x)=>DropdownMenuItem(value:x,child:Text(x))).toList(),onChanged:(x)=>setState(()=>prior=x??prior)),const SizedBox(height:12),TextField(controller:notes,maxLines:3,decoration:const InputDecoration(labelText:'Observações (opcional)')),const SizedBox(height:15),SizedBox(width:double.infinity,child:FilledButton(onPressed:photo==null?null:()=>setState(()=>report=true),child:const Text('GERAR RELATÓRIO INICIAL'))),if(report)...[const SizedBox(height:15),Panel(child:Column(crossAxisAlignment:CrossAxisAlignment.start,children:[const Text('RELATÓRIO PRELIMINAR',style:TextStyle(color:aqua,fontWeight:FontWeight.bold)),const SizedBox(height:10),Text('Superfície: $surface'),Text('Observação: $issue'),Text('Produto anterior: $prior'),if(notes.text.trim().isNotEmpty)Text('Notas: ${notes.text.trim()}'),const Divider(height:24),const Text('Este relatório organiza as respostas; não houve análise de IA da foto. Não confirma fibra, causa da mancha ou presença de mofo. Consulte a etiqueta do estofado e as instruções oficiais do produto. Não misture químicos.',style:TextStyle(color:muted,height:1.5,fontSize:12)),const SizedBox(height:12),SizedBox(width:double.infinity,child:OutlinedButton(onPressed:()=>widget.save(Record(surface,issue,notes.text.trim(),DateTime.now())),child:const Text('SALVAR COMO SERVIÇO')))]))]]));}
class Products extends StatelessWidget{const Products({super.key});@override Widget build(BuildContext c)=>const Frame(label:'Base técnica',title:'Produtos',desc:'Catálogo planejado para produtos reais, variantes exatas e fontes verificáveis.',child:Column(children:[Panel(child:Column(children:[Icon(Icons.menu_book_outlined,color:aqua,size:40),SizedBox(height:12),Text('Catálogo verificável em preparação',textAlign:TextAlign.center,style:TextStyle(fontWeight:FontWeight.bold,fontSize:17)),SizedBox(height:8),Text('Não incluí produtos fictícios nem diluições inventadas. Cada ficha precisa apontar para documentação confiável do fabricante.',textAlign:TextAlign.center,style:TextStyle(color:muted,height:1.5,fontSize:12))])),SizedBox(height:12),Info(icon:Icons.verified_outlined,title:'Dados oficiais',desc:'Rótulo, ficha técnica, composição e pH quando documentados.'),Info(icon:Icons.check_circle_outline,title:'Compatibilidade',desc:'Materiais indicados, contraindicações e instruções oficiais.'),Info(icon:Icons.groups_outlined,title:'Relatos profissionais',desc:'Experiências contextualizadas, separadas das instruções do fabricante.'),Info(icon:Icons.calculate_outlined,title:'Diluição',desc:'Calculadora só será liberada com instrução oficial verificada.') ]));}
class Record{final String surface,issue,note;final DateTime date;Record(this.surface,this.issue,this.note,this.date);Map<String,dynamic> toJson()=>{'surface':surface,'issue':issue,'note':note,'date':date.toIso8601String()};factory Record.fromJson(Map<String,dynamic> j)=>Record((j['surface']??'Outro').toString(),(j['issue']??'Origem desconhecida').toString(),(j['note']??'').toString(),DateTime.tryParse((j['date']??'').toString())??DateTime.now());}
class Services extends StatelessWidget{final List<Record> records;final ValueChanged<Record> delete;const Services({super.key,required this.records,required this.delete});@override Widget build(BuildContext c)=>Frame(label:'Organização profissional',title:'Serviços',desc:'Histórico local das avaliações registradas neste aparelho.',child:records.isEmpty?const Panel(child:Column(children:[Icon(Icons.assignment_outlined,color:aqua,size:40),SizedBox(height:10),Text('Nenhum serviço salvo ainda',style:TextStyle(fontWeight:FontWeight.bold,fontSize:17)),SizedBox(height:6),Text('Faça uma avaliação no Scanner e salve o relatório.',style:TextStyle(color:muted,fontSize:12))])):Column(children:records.map((r)=>Padding(padding:const EdgeInsets.only(bottom:10),child:Panel(child:Row(children:[const Icon(Icons.cleaning_services_outlined,color:aqua),const SizedBox(width:10),Expanded(child:Column(crossAxisAlignment:CrossAxisAlignment.start,children:[Text(r.surface,style:const TextStyle(fontWeight:FontWeight.bold)),Text(r.issue,style:const TextStyle(color:muted,fontSize:12)),Text('${r.date.day}/${r.date.month}/${r.date.year}',style:const TextStyle(color:aqua,fontSize:10))])),IconButton(onPressed:()=>delete(r),icon:const Icon(Icons.delete_outline))])))).toList()));}
class Profile extends StatelessWidget{const Profile({super.key});@override Widget build(BuildContext c)=>const Frame(label:'Preferências',title:'Perfil',desc:'Configurações e informações do aplicativo.',child:Column(children:[Panel(child:Row(children:[Icon(Icons.water_drop_rounded,color:aqua,size:40),SizedBox(width:12),Expanded(child:Column(crossAxisAlignment:CrossAxisAlignment.start,children:[Text('HigienizaPro',style:TextStyle(fontSize:20,fontWeight:FontWeight.w900)),Text('Ferramentas para profissionais',style:TextStyle(color:muted,fontSize:12))]))])),SizedBox(height:12),Info(icon:Icons.lock_outline,title:'Privacidade',desc:'Conta e sincronização ainda não configuradas.'),Info(icon:Icons.save_outlined,title:'Armazenamento local',desc:'O aplicativo tenta manter os serviços neste aparelho. A persistência ainda precisa ser validada em testes.'),Info(icon:Icons.info_outline,title:'Versão 0.1.0',desc:'Versão de desenvolvimento; compilação e persistência ainda precisam de validação.') ]));}
class Info extends StatelessWidget{final IconData icon;final String title,desc;const Info({super.key,required this.icon,required this.title,required this.desc});@override Widget build(BuildContext c)=>Padding(padding:const EdgeInsets.only(bottom:10),child:Panel(child:Row(crossAxisAlignment:CrossAxisAlignment.start,children:[Icon(icon,color:aqua),const SizedBox(width:12),Expanded(child:Column(crossAxisAlignment:CrossAxisAlignment.start,children:[Text(title,style:const TextStyle(fontWeight:FontWeight.bold)),const SizedBox(height:5),Text(desc,style:const TextStyle(color:muted,fontSize:12,height:1.45))]))])));}
