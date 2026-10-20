import 'package:flutter_test/flutter_test.dart';
import 'package:higienizapro/main.dart';
void main(){testWidgets('mostra scanner e navegação',(tester)async{await tester.pumpWidget(const HigienizaPro());await tester.pump(const Duration(milliseconds:50));expect(find.text('Scanner de estofados'),findsOneWidget);expect(find.text('INICIAR AVALIAÇÃO'),findsOneWidget);expect(find.text('Produtos'),findsWidgets);});}
