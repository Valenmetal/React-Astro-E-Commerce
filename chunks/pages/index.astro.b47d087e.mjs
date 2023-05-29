import { _ as __astro_tag_component__, c as createAstro, a as createComponent, r as renderTemplate, m as maybeRenderHead, d as renderComponent } from '../astro.d097d118.mjs';
import { $ as $$Icon, a as $$Layout } from './_id_.astro.a0d9d23b.mjs';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Orbit } from '@uiball/loaders';
import { jsx, Fragment, jsxs } from 'react/jsx-runtime';
/* empty css                           */import 'html-escaper';
import 'svgo';
/* empty css                           *//* empty css                          */
const data = [
	{
		id: 1,
		name: "Chapa Cincalum",
		description: "c25 / c27",
		description_2: "• Chapa cincalum acanalada calibre 25 y 27\n\n• Largo: 3 - 3.5 - 4 - 4.5 - 5 - 5.5 - 6 (Mts)\n\n• Ancho: 1 (Mts)",
		src: "src/img/chapa-cincalum-1.webp",
		src2: "src/img/chapa-cincalum-2.webp",
		src3: "src/img/chapa-cincalum-3.webp",
		src4: "src/img/chapa-cincalum-4.webp",
		src5: "src/img/chapa-cincalum-5.webp",
		src6: "src/img/chapa-cincalum-6.webp",
		category: "chapas"
	},
	{
		id: 2,
		name: "Chapa Galvanizada",
		description: "c27",
		description_2: "• Chapa galvanizada acanalada calibre 27\n\n• Largo: 3 - 3.5 - 4 - 4.5 - 5 - 5.5 - 6 (Mts)\n\n• Ancho: 1 (Mts)",
		src: "src/img/chapa-galvanizada-1.webp",
		src2: "src/img/chapa-galvanizada-2.webp",
		src3: "src/img/chapa-galvanizada-3.webp",
		src4: "src/img/chapa-galvanizada-4.webp",
		src5: "src/img/chapa-galvanizada-5.webp",
		category: "chapas"
	},
	{
		id: 3,
		name: "Chapa Color",
		description: "c25 / c27",
		description_2: "• Chapa color acanalada calibre 25 y 27\n\n• Colores: Gris y Negro\n\n• Largo: 3 - 3.5 - 4 - 4.5 - 5 - 5.5 - 6 (Mts)\n\n• Ancho: 1 (Mts)",
		src: "src/img/Chapa-Acanalada-Color-Negra-1.webp",
		src2: "src/img/Chapa-Acanalada-Color-Negra-2.webp",
		src3: "src/img/Chapa-Acanalada-Color-Negra-3.webp",
		src4: "src/img/Chapa-Acanalada-Color-Gris.webp",
		src5: "src/img/chapa-gris.webp",
		category: "chapas"
	},
	{
		id: 4,
		name: "Chapas Plasticas",
		description: "Plast. Acrilica\nPoliprop.\nPolicarb. cristal",
		description_2: "• Chapas de:\n\n• Plastico Acrilico\n• Polipropileno - Das Dach\n• Policarbonato cristal (transparente)",
		src: "src/img/chapa-plastica-1.webp",
		src2: "src/img/chapa-plastica-2.webp",
		src3: "src/img/chapa-plastica-3.webp",
		src4: "src/img/chapa-plastica-4.webp",
		src5: "src/img/chapa-plastica-5.webp",
		src6: "src/img/chapa-plastica-6.webp",
		category: "chapas"
	},
	{
		id: 5,
		name: "Chapa Lisa",
		description: "c25 / c27",
		description_2: "• Chapa lisa galvanizada calibre 25 y 27\n\n• Medidas: 2,44 x 1,22 Mts",
		src: "src/img/chapa-lisa-1.webp",
		src2: "src/img/chapa-lisa-2.webp",
		src3: "src/img/chapa-lisa-3.webp",
		category: "chapas"
	},
	{
		id: 6,
		name: "Trapezoidal T101 Cincalum",
		description: "c25",
		description_2: "• Chapa Trapezoidal T101 Cincalum calibre 25\n\n• Colores: Verde, Gris, Negro, Bordo, Azul y Blanco\n\n• Largo: 3 - 3.5 - 4 - 4.5 - 5 - 5.5 - 6 (Mts)\n\n• Ancho: 1 (Mts)",
		src: "src/img/Chapa-Trapezoidal-T101.webp",
		src2: "src/img/Chapa-Trapezoidal-T101-2.webp",
		src3: "src/img/Chapa-Trapezoidal-T101-3.webp",
		src4: "src/img/Chapa-Trapezoidal-T101-4.webp",
		category: "chapas"
	},
	{
		id: 7,
		name: "Trapezoidal T101 Color",
		description: "Gris-Negro-Bordo-Azul-Verde",
		description_2: "• Chapa Color Trapezoidal T101 calibre 25\n\n• Colores: Verde, Gris, Negro, Bordo, Azul y Blanco\n\n• Largo: 3 - 3.5 - 4 - 4.5 - 5 - 5.5 - 6 (Mts)\n\n• Ancho: 1 (Mts)",
		src: "src/img/Chapa-Trapezoidal-T101-Verde.webp",
		src2: "src/img/Chapa-Trapezoidal-T101-Gris.webp",
		src3: "src/img/Chapa-Trapezoidal-T101-Negro.webp",
		src4: "src/img/Chapa-Trapezoidal-T101-Bordo.webp",
		src5: "src/img/Chapa-Trapezoidal-T101-Azul.webp",
		src6: "src/img/Chapa-Trapezoidal-T101-Blanco.webp",
		category: "chapas"
	},
	{
		id: 8,
		name: "Tejado Metalico",
		description: "c25-Negro/Bordo",
		description_2: "• Tejado Metalico simil teja francesa \n\n• Colores: Negro y Bordo\n\n• Largo: 5max(Mts)\n\n• Ancho: 1.10 (Mts)\n\n• Características:\n\n- Durabilidad\n\n- Resistencia\n\n- Garantía contra granizo\n\n- Menor costo de material y mano de obra que en un techo de tejas tradicional\n\n- Peso reducido ( Facilita el transporte y reduce el costo de estructura )\n\n- Mayor limpieza en la obra\n\n- Mayor rapidez en la instalación\n\n- Economía y racionalidad en la ejecución\n\n- Evita filtraciones\n\n- Fácil reemplazo\n\n- Libre mantenimiento\n\n- Estéticamente impecable\n\n- Se adapta a cualquier estilo arquitectónico\n\n- Apto para techos de construcciones en seco o tradicionales",
		src: "src/img/tejado-metalico-2.webp",
		src2: "src/img/tejado-metalico-1.webp",
		src3: "src/img/tejado-metalico-3.webp",
		src4: "src/img/tejado-metalico-4.webp",
		category: "chapas"
	},
	{
		id: 9,
		name: "Sombrero H",
		description: "3'' / 4'' / 5'' / 6''",
		description_2: "• Sombrero H chapa galvanizada\n\n• Tamaños: 3'' / 4'' / 5'' / 6''",
		src: "src/img/sombrero-h-1.webp",
		src2: "src/img/sombrero-h-2.webp",
		src3: "src/img/sombrero-h-3.webp",
		category: "zingueria"
	},
	{
		id: 10,
		name: "Sombrero Doble",
		description: "3'' / 4'' / 5'' / 6''",
		description_2: "Sombrero Doble Aro Gas galvanizado\n\n• 3'' / 4'' / 5'' / 6''",
		src: "src/img/sombrero-doble-gas.webp",
		src2: "src/img/sombrero-doble-gas-2.webp",
		src3: "src/img/sombrero-doble-gas-3.webp",
		category: "zingueria"
	},
	{
		id: 11,
		name: "Eolico",
		description: "4'' / 6'' / 8'' / 16'' / 24'' / 30''",
		description_2: "• Extractores eólicos fabricados con chapa galvanizada y flejes de aluminio\n\n• Son silenciosos, eficientes, económicos, sin costos de consumo ni de mantenimiento.\n\n• No hay sistema de ventilación más económico y practico que la ventilación natural en base a extracción eólica.\n\n• Tamaños: 4'' / 6'' / 8'' / 16'' / 24'' / 30''",
		src: "src/img/eolico-1.webp",
		src2: "src/img/eolico-2.webp",
		src3: "src/img/eolico-3.webp",
		category: "zingueria"
	},
	{
		id: 12,
		name: "Ramal Y",
		description: "3'' / 4'' / 5'' / 6''",
		description_2: "Ramal Y galvanizado\n\n• Tamaños: 3'' / 4'' / 5'' / 6''",
		src: "src/img/ramal-y-3p.webp",
		src2: "src/img/ramal-y-4p.webp",
		src3: "src/img/ramal-y-5p.webp",
		category: "zingueria"
	},
	{
		id: 13,
		name: "Ramal T",
		description: "3'' / 4'' / 5'' / 6''",
		description_2: "Ramal T galvanizado\n\n• Tamaños: 3'' / 4'' / 5'' / 6''",
		src: "src/img/ramal-t-3p.webp",
		src2: "src/img/ramal-t-4p.webp",
		src3: "src/img/ramal-t-5p.webp",
		category: "zingueria"
	},
	{
		id: 14,
		name: "Flexible",
		description: "3'' / 4'' / 5''",
		description_2: "Flexible de aluminio\n\n• Tamaños: 3'' / 4'' / 5''\n\n• Medidas: 1 y 2 Mts",
		src: "src/img/flexible.webp",
		src2: "src/img/flexible-2.webp",
		category: "zingueria"
	},
	{
		id: 15,
		name: "Grampa Omega",
		description: "3'' / 4'' / 5'' / 6''",
		description_2: "Grampa Omega\n\n• Tamaños: 3'' / 4'' / 5'' / 6''",
		src: "src/img/grampa-1.webp",
		src2: "src/img/grampa-2.webp",
		src3: "src/img/grampa-3.webp",
		category: "zingueria"
	},
	{
		id: 16,
		name: "Tornillos",
		description: "Para Chapa y Placa de Yeso",
		description_2: "• Tornillos para chapa 14x1 1/2, 14x2,14x2 1/2 madera y hierro\n\n• Tornillos para placa de yeso T1 ,T2 ,fijaciones de 6 y 8",
		src: "src/img/tornillos.webp",
		src2: "src/img/tornillo-autoperforante-acero.webp",
		src3: "src/img/tornillo-2.webp",
		src4: "src/img/tornillo-3.webp",
		category: "otros"
	},
	{
		id: 17,
		name: "Aislante Aluminizado",
		description: "Aislante Espuma Aluminizado",
		description_2: "• Aislante Espuma una cara Aluminizada\n\n• Medida: 20Mts²\n\n• Espesor: 10mm",
		src: "src/img/espuma-aluminio-1.webp",
		src2: "src/img/espuma-aluminio-2.jpeg",
		src3: "src/img/espuma-aluminio-3.webp",
		src4: "src/img/espuma-aluminio-4.webp",
		category: "aislantes"
	},
	{
		id: 18,
		name: "Lana de Vidrio Isover",
		description: "Rolac Plata Cubierta HR",
		description_2: " Lana de Vidrio Isover Rolac Plata Cubierta HR una cara de aluminio\n\n- Medida: 21,6Mts²\n\n- Espesor: 50mm\n\n• Bajo coeficiente de conductividad.\n\n• Coeficiente constante.\n\n• Contribuye al ahorro energético.\n\n• Fácil de cortar e instalar.\n\n• No es corrosiva.\n\n• Reduce las emisiones de CO2 durante el uso del inmueble.",
		src: "src/img/Lana-rosa-1.webp",
		src2: "src/img/Lana-rosa-2.webp",
		src3: "src/img/Lana-rosa-3.webp",
		category: "aislantes"
	},
	{
		id: 19,
		name: "Lana de Vidrio Isover",
		description: "Fieltro Liviano HR",
		description_2: " Lana de Vidrio Isover Fieltro Liviano HR para aumento de espesores\n\n- Medida: 21,6Mts²\n\n- Espesor: 50mm\n\n• Alto nivel de aislación térmica, acústica.\n\n• Control de la condensación (superficial e intersticial).\n\n• 100% Incombustible.\n\n• Solapa longitudinal que asegura la continuidad de la barrera de vapor.\n\n• Liviano.\n\n• Suave al Tacto.\n\n• Fácil de cortar.\n\n• Flexible.",
		src: "src/img/Lana-violeta-1.webp",
		src2: "src/img/Lana-violeta-2.webp",
		category: "aislantes"
	},
	{
		id: 20,
		name: "Fieltro Asfáltico Standard",
		description: "20Mts² / 40Mts²",
		description_2: "Aplicaciones\n\n• Bajo teja o chapa\n\n• En techos sobre estructura de madera, como aislante hidráulico\n\n• Bajo cubiertas metálicas, evita el goteo por condensación\n\n• Como protección del aislamiento térmico\n\n• Como refuerzo en impermeabilizaciones multicapa fabricadas con asfalto en obra\n\n• Como membrana de refuerzo en sistemas de impermeabilización en frío o caliente\n\n• Como membrana protectora de sistemas que van a recibir un acabado o un relleno\n\n• En muros como aislante hidráulico y del viento\n\n\n Ventajas\n\n• Aislante hidráulico\n\n• No retiene vapor en el techado\n\n• No absorve la humedad ambiente\n\n• Flexible\n\n• De simple instalación",
		src: "src/img/rubbersec.webp",
		category: "aislantes"
	},
	{
		id: 21,
		name: "Cinta Aluminio",
		description: "10Mts / 45Mts",
		description_2: "Cinta Aluminio de 10Mts y 45Mts PROTERM indicada para la unión de aislantes térmicos, proteger, cubrir, aislar y reparar.\n\nApta para reparaciones en las cubiertas metalicas y aislantes con foil de aluminio. \n\n-CARACTERÍSTICAS:\n\n• Resistente al fuego, la humedad, condiciones climáticas adversas y agentes químicos.\n\n• No se deteriora con el tiempo, posee protección UV\n\n• Alta aislación térmica\n\n• Reflectante a las altas temperaturas y la luz\n\n• Gran adaptabilidad y fuerza adhesiva\n\n• Facilidad de arranque que simplifica los trabajos en altura",
		src: "src/img/cinta-aluminio.webp",
		src2: "src/img/cinta-aluminio-2.webp",
		src3: "src/img/cinta-aluminio-3.webp",
		category: "aislantes"
	},
	{
		id: 22,
		name: "Malla Plastica",
		description: "2x25Mts / 2x50Mts",
		description_2: "Malla Plastica sosten\n\n• Medidas: 2x25 y 2x50",
		src: "src/img/malla-plastica-1.webp",
		src2: "src/img/malla-plastica-2.webp",
		src3: "src/img/malla-plastica-3.webp",
		category: "aislantes"
	},
	{
		id: 23,
		name: "Membrana Megaflex",
		description: "40kg",
		description_2: "• Membrana asfáltica con revestimiento de aluminio No Crack para impermeabilización de terrazas y cubiertas no transitables\n\n• Peso: 40kg\n\n• Medida: 10Mts²",
		src: "src/img/megaflex-1.webp",
		src2: "src/img/megaflex-2.webp",
		src3: "src/img/megaflex-3.webp",
		category: "aislantes"
	},
	{
		id: 24,
		name: "Membrana ClipperFlex",
		description: "35kg",
		description_2: "• Impermeabilizaciones expuestas, no transitables.\n\n• Aplicable sobre cualquier tipo de superficies como ser: losas, bóvedas, techos de chapa galvanizada y fibrocemento, techos planos y abovedados con todo tipo de pendientes.\n\n• No aplicable debajo de una carpeta de cemento, cal y arena, ya que el contacto de estos materiales con el aluminio produce oxidación y deterioro de la membrana.\n\n\n\n-Ventajas\n\n• Mayor flexibilidad y adaptabilidad.\n\n• Mayor elongación y resistencia mecánica.\n\n• Gran durabilidad.\n\n• No se rompen ni se quiebran.\n\n• Buen comportamiento ante climas adversos.\n\n• Reduce la absorción térmica por radiación solar.\n\n• Pueden permanecer expuestas a los rayos U.V.\n\n• Peso: 35kg\n\n• Medida: 10Mts²",
		src: "src/img/clipperflex.webp",
		category: "aislantes"
	},
	{
		id: 25,
		name: "Membrana Autoadhesiva",
		description: "10cm",
		description_2: "• La membrana autoadhesiva es un material apreciado por su sencilla colocación. Al igual que las membranas asfálticas, su calidad depende de la materia prima utilizada. En Metalflex/Clipperflex trabajamos con un asfalto modificado con polímeros, cuya características más importante es la adhesividad a temperatura ambiente.\n\n• Debido al alto costo de este tipo de asfaltos y al hecho de que no se utiliza soplete en su colocación, no es necesario un gran espesor.\n\n\n\n• ULTRA ADHESIVO\n\n• ALUMINIO FLEXIBLE\n\n• FÁCIL COLOCACIÓN\n\n• ADAPTABLE A DIVERSOS USOS\n\n• Medida: 10cm",
		src: "src/img/autoadhesiva-1.webp",
		src2: "src/img/autoadhesiva-2.webp",
		src3: "src/img/autoadhesiva-3.webp",
		category: "aislantes"
	},
	{
		id: 26,
		name: "Sellador Acetico",
		description: "Acetica Multiuso 250ml",
		description_2: "• Sellador Unipega Acetico\n• 280ml\n\n• Versatil para diversos sellados del día a día\n\n• Sellador de silicona monocomponente de curado acetico indicado para el sellado de aluminio, vidrio, azulejo, cerámica, sanitarios y box de baños. Resistente a la formación de hongos. Con propiedades de no escurrimiento, cura con la humedad ambiente, formando un caucho flexible y durable.",
		src: "src/img/acetico.webp",
		src2: "src/img/acetico2.webp",
		src3: "src/img/acetico3.webp",
		category: "selladores"
	},
	{
		id: 27,
		name: "Sellador Hibrido",
		description: "Adhesivo Hibrido 280ml",
		description_2: "• Selladores Unipega Hibrido\n• 280ml\n\n• Adhesivo para diversas aplicaciones en la construcción\n\n• Adhesivo híbrido monocomponente indicado para sellado en juntas de movimiento, fachadas de edificaciones y de acero galvanizado, albañilería y otros sustratos porosos y no porosos. Con propiedades de no escurrimiento, cura a temperatura ambiente, permaneciendo flexible por muchos años. Resiste a agentes climáticos y rayos UV.",
		src: "src/img/hibrido.webp",
		src2: "src/img/hibrido2.webp",
		src3: "src/img/hibrido3.webp",
		category: "selladores"
	},
	{
		id: 28,
		name: "Sellador PuFlex",
		description: "PuFlex Uso General 280ml",
		description_2: "• Sellador Unipega PuFlex\n\n• Alta elasticidad para sellados y calafateos en general\n\n• Sellador híbrido monocomponente indicado para pegados y calafateos perimetrales en general. Sella madera, acero, aluminio, cerámica, concreto, canaletas y rieles. Con propiedades de no escurrimiento, cura con la humedad ambiente, formando un caucho flexible y durable. Una vez curado, se puede pintar.",
		src: "src/img/puflex.webp",
		src2: "src/img/puflex2.webp",
		src3: "src/img/puflex3.webp",
		category: "selladores"
	},
	{
		id: 29,
		name: "Sellador Acrilico",
		description: "Sella Grietas Sellador Acrilico 280ml",
		description_2: "• Sella Grietas Unipega\n• 280ml\n\n• Sella grietas y juntas\n\n• Sellador flexible con fungicida, libre de solventes, recomendado para construcciones sustentables. Indicado para pegar y sellar alrededor de perfiles, zócalos, marcos, aplicaciones en juntas y acabados de muebles. Se adhiere en madera, MDF, compensado, concreto, yeso, drywall, piedra y albañilería. Puede recibir revestimiento sobre la aplicación y puede ser pintado.",
		src: "src/img/trincas.webp",
		src2: "src/img/trincas2.webp",
		src3: "src/img/trincas3.webp",
		category: "selladores"
	},
	{
		id: 30,
		name: "Sellador Pu 40",
		description: "Sellador Pu 40 Profesional 280ml",
		description_2: "• Sellador Unipega Pu 40 Uso Profesional\n• 280ml\n\n• Sellador híbrido uso profesional\n\n• Sellador flexible con fungicida, libre de solventes, recomendado para construcciones sustentables. Indicado para pegar y sellar alrededor de perfiles, zócalos, marcos, aplicaciones en juntas y acabados de muebles. Se adhiere en madera, MDF, compensado, concreto, yeso, drywall, piedra y albañilería. Puede recibir revestimiento sobre la aplicación y puede ser pintado.",
		src: "src/img/pu40.webp",
		src2: "src/img/pu402.webp",
		src3: "src/img/pu403.webp",
		category: "selladores"
	},
	{
		id: 31,
		name: "Sellador Alta temperatura",
		description: "Alta temperatura 50ml",
		description_2: "• Fijaciones y sellados que exijan resistencia a temperaturas desde -30°C hasta +315°C\n\n• 50ml",
		src: "src/img/alta-temp.webp",
		category: "selladores"
	},
	{
		id: 32,
		name: "Sellador Hibrido",
		description: "Fija Todo 50ml",
		description_2: "• Fuerza de adhesión para las aplicaciones más difíciles\n\n• Adhesivo híbrido monocomponente indicado para el pegado y sellado de materiales porosos y no porosos, como metales, concreto, piedras, cerámicas, vidrio, policarbonato y PVC. Debido al alto poder de adhesión inicial es indicado para la fijación de espejos y pegado de bachas y fregaderos. Con propiedades de no escurrimiento, cura con la humedad ambiente, formando un caucho flexible y durable.\n\n• 50ml",
		src: "src/img/fija-todo-1.webp",
		src2: "src/img/fija-todo-3.webp",
		src3: "src/img/fija-todo-2.webp",
		category: "selladores"
	},
	{
		id: 33,
		name: "Sellador Acetico",
		description: "Uso General 50ml",
		description_2: "• Sellador de silicona monocomponente de curado acético indicado para el sellado de aluminio, vidrio, azulejo, cerámica, sanitarios y box de baños. Resistente a la formación de hongos. Con propiedades de no escurrimiento, cura con la humedad ambiente, formando un caucho flexible y durable.\n\n• 50ml",
		src: "src/img/uso-general-1.webp",
		src2: "src/img/uso-general-2.webp",
		src3: "src/img/uso-general-3.webp",
		category: "selladores"
	},
	{
		id: 34,
		name: "Codo Redondo",
		description: "3'' / 4'' / 5'' / 6''",
		description_2: "• Codo soldado Redondo para Agua galvanizado\n\n• Medidas: 3'' / 4'' / 5'' / 6''",
		src: "src/img/codo_agua.webp",
		src2: "src/img/codo_agua2.webp",
		src3: "src/img/codo_agua3.webp",
		src4: "src/img/codo_agua4.webp",
		src5: "src/img/codo_agua5.webp",
		src6: "src/img/codo_agua6.webp",
		category: "zingueria"
	},
	{
		id: 35,
		name: "Codo Rectangular",
		description: "2''x4'' / 3''x5''",
		description_2: "• Codo soldado Rectangular para Agua galvanizado\n\n• Medidas: 2''x4'' / 3''x5''",
		src: "src/img/codo.webp",
		src2: "src/img/codo2.webp",
		src3: "src/img/codo3.webp",
		src4: "src/img/codo4.webp",
		category: "zingueria"
	},
	{
		id: 36,
		name: "Curva Articulada",
		description: "3'' / 4'' / 5'' / 6''",
		description_2: "• Curva Articulada Galvanizada\n\n• Medidas: 3'' / 4'' / 5'' / 6''",
		src: "src/img/curva_articulada.webp",
		src2: "src/img/curva_articulada-2.webp",
		src3: "src/img/curva_articulada-3.webp",
		src4: "src/img/curva_articulada-4.webp",
		category: "zingueria"
	},
	{
		id: 37,
		name: "Curva Corrugada",
		description: "3'' / 4'' / 5'' / 6''",
		description_2: "• Curva Corrugada Galvanizada\n\n• Medidas: 3'' / 4'' / 5'' / 6''",
		src: "src/img/curva_corrugada.webp",
		src2: "src/img/curva_corrugada2.webp",
		src3: "src/img/curva_corrugada3.webp",
		src4: "src/img/curva_corrugada4.webp",
		src5: "src/img/curva_corrugada5.webp",
		src6: "src/img/curva_corrugada6.webp",
		category: "zingueria"
	},
	{
		id: 38,
		name: "Colectores",
		description: "5x10CM",
		description_2: "• Recibidor de agua fabricado en Chapa Galvanizada con salida para caño 5x10CM• Varios modelos",
		src: "src/img/colectores.webp",
		src2: "src/img/colectores2.webp",
		src3: "src/img/colectores3.webp",
		src4: "src/img/colectores4.webp",
		src5: "src/img/colectores6.webp",
		src6: "src/img/colectores8.webp",
		category: "zingueria"
	},
	{
		id: 39,
		name: "Reducciones",
		description: "3'' / 4'' / 5'' / 6''",
		description_2: "• Reduccion de Aluminio\n\n• Medidias: 100 a 110mm\n\n5'' a 6''\n\n4'' a 6''\n\n3'' a 4''",
		src: "src/img/reduccion.webp",
		src2: "src/img/reduccion2.webp",
		src3: "src/img/reduccion3.webp",
		src4: "src/img/reduccion4.webp",
		src5: "src/img/reduccion5.webp",
		src6: "src/img/reduccion6.webp",
		category: "zingueria"
	},
	{
		id: 40,
		name: "Caños Galvanizados",
		description: "3'' 4'' 5'' 6''",
		description_2: "• Caños Galvanizados\n\n• Calibre: 28\n\n• Medidas: 3'' 4'' 5'' 6''\n\n• Largo: 1Mt",
		src: "src/img/cano-galvanizado-1.webp",
		src2: "src/img/cano-galvanizado-2.webp",
		category: "zingueria"
	},
	{
		id: 41,
		name: "Caños Enlozados",
		description: "4'' 6''",
		description_2: "• Caños Enlozados para salamandra/estufa(negro brillante)\n\n• Medidas: 4'' 6''",
		src: "src/img/cano-enlozado-1.webp",
		src2: "src/img/cano-enlozado-2.webp",
		src3: "src/img/cano-enlozado-3.webp",
		category: "zingueria"
	},
	{
		id: 42,
		name: "Placas de Yeso",
		description: "9,5mm / 12,5 mm",
		description_2: "• Placa de yeso de gran durabilidad y resistencia.\n\n• Apta para cielorrasos, divisiones y revestimeintos de obras particulares. Logrando excelentes terminaciones, rapidez y velocidad en cada obra.\n\n• Espesor: 9,5 y 12,5 mm.",
		src: "src/img/placa-yeso-1.webp",
		src2: "src/img/placa-yeso-2.webp",
		category: "seco"
	},
	{
		id: 43,
		name: "Masilla Anclaflex",
		description: "7kg / 15kg / 32kg",
		description_2: "• Masilla Anclaflex Plus Placas de yeso\n\n• 7kg / 15kg / 32kg\n\n- Uso interior\n\n- Para el pegado de cintas de papel o tramada, tomado de juntas, recubrimiento de tornillos de sujeción, perfiles, reparar zonas dañadas o irregularidades de placas, terminación final en tabiques y cielorrasos de placa de roca de yeso",
		src: "src/img/masilla.webp",
		category: "seco"
	},
	{
		id: 44,
		name: "Pasatechos",
		description: "Comun y alta temperatura",
		description_2: "• Pasatecho comun(3, 4 y 5)\n\n• Alta temperatura(4)",
		src: "src/img/pasatecho-1.webp",
		src2: "src/img/pasatecho-2.webp",
		src3: "src/img/pasatecho-3.webp",
		src4: "src/img/pasatecho-4.webp",
		category: "otros"
	},
	{
		id: 45,
		name: "Cierre Hermetico Compriband",
		description: "Acanalada / T101(Trapezoidal)",
		description_2: "• Cierre Hermetico Base Para Chapa Acanalada o T101(Trapezoidal)\n\n• Medida: 1Mt",
		src: "src/img/compriband-1.webp",
		src2: "src/img/compriband-2.webp",
		src3: "src/img/compriband-3.webp",
		src4: "src/img/compriband-4.webp",
		src5: "src/img/compriband-5.webp",
		category: "otros"
	},
	{
		id: 46,
		name: "Ganchos",
		description: "J5 / J6",
		description_2: "• Ganchos J5 y J6 para chapas",
		src: "src/img/gancho-1.webp",
		src2: "src/img/gancho-2.webp",
		category: "otros"
	},
	{
		id: 47,
		name: "Lubricante Uso General",
		description: "Lubricante Unipega",
		description_2: "• UNI LUB LUBRICANTE USO GENERAL\n\n• Unilub es un lubricante de uso general desarrollado para reducir la fricción y, consecuentemente, el desgaste entre las partes metálicas, eliminando ruidos y lubricando por completo debido a su alto poder penetrante. Protege por mucho más tiempo contra la óxido y la intemperie. En la industria, Lubrica y protege máquinas, herramientas livianas y pesadas, cojinetes, cintas transportadoras, válvulas de seguridad, ejes, motores eléctricos, engranajes, poleas y otros equipos industriales, partes mecánicas de automóviles, desde cables, cojinetes, engranajes, poleas e incluso piezas eléctricas. En el uso general, puede ser utilizado en cerraduras, bisagras, pasadores, herramientas, electrodomésticos, máquinas de coser, limpiar y otras, bicicletas y cualquier pieza metálica.",
		src: "src/img/lub.webp",
		category: "otros"
	},
	{
		id: 48,
		name: "Cintas",
		description: "Para Placa de Yeso",
		description_2: "• Cinta para Placa de Yeso Tramada Autoadhesiva:\n -90 Mts\n\n• Cinta de papel: \n -23 Mts\n -75 Mts\n -150 Mts",
		src: "src/img/cintas.webp",
		category: "otros"
	},
	{
		id: 49,
		name: "Adhesivo Para Molduras",
		description: "1Kg",
		description_2: "•1Kg\n\n-Adhesivo listo para usar.\n-Debe aplicarse sobre superficies limpias, secas, firmes y libres de polvos.\n-Aplicar sobre ambas caras de la moldura a pegar en cantidades abundantes con la espátula, colocar la moldura sobre la pared logrando un excedente de adhesivo.\n-Quite el excedente inmediatamente con una esponja o trapo húmedo.\n-Para lograr una mejor terminación pinte 24 horas después de colocada la moldura\n-Utilizar en ambientes ventilados\n-Mantener alejado de los niños\n-Ante contacto con ojos lavar con abundante agua y efectuar consulta médica.\n-Ante ingestión efectuar consulta médica.",
		src: "src/img/adhesivo-moldura.webp",
		category: "seco"
	},
	{
		id: 50,
		name: "Molduras Decorativas",
		description: "2 Mts",
		description_2: "• Molduras decorativas para techos, Poliestireno extruido\n -2 Mts\n\n• DE05: 35mm\n\n• DE09: 44mm\n\n• DE13: 52mm",
		src: "src/img/molduras.webp",
		src2: "src/img/De-05.webp",
		src3: "src/img/De-09.webp",
		src4: "src/img/De-13.webp",
		category: "seco"
	},
	{
		id: 51,
		name: "Yeso Yemaco",
		description: "1Kg",
		description_2: "• El Yeso Yemaco Durlock® es un Yeso tradicional para la construcción, ideal para realizar enlucidos de paredes y cielorrasos. Se emplea de forma manual en ambientes interiores.\n\n• Propiedades\n• Resistencia al fuego\n• Aislamiento térmico\n\nBeneficios\n• Máximo tenor de pureza.\n• Granulometría uniforme.\n• Compatible con los distintos tipos de agua del país.\n• Gran Terminación\n• No requiere el agregado de cemento de obra.",
		src: "src/img/yeso-yemaco.webp",
		category: "seco"
	},
	{
		id: 52,
		name: "Caño Rectangular Galvanizado",
		description: "c28",
		description_2: "• Caños Rectangular Galvanizado\n\n-Calibre: c28\n-Medidas: 10x5 \n-Largo: 1 Mt",
		src: "src/img/caño-rectangular-1.webp",
		src2: "src/img/caño-rectangular-2.webp",
		src3: "src/img/caño-rectangular-3.webp",
		category: "zingueria"
	},
	{
		id: 53,
		name: "Canaleta Americana Galvanizada",
		description: "c27",
		description_2: "• Canaleta Americana D30 Galvanizada\n\n-Calibre: c27\n-Largo: 2,44 Mts",
		src: "src/img/canaleta-1.webp",
		src2: "src/img/canaleta-2.webp",
		src3: "src/img/canaleta-3.webp",
		src4: "src/img/canaleta-4.webp",
		category: "zingueria"
	},
	{
		id: 54,
		name: "Sombrero Venturi Americano",
		description: "4'' hasta 12''",
		description_2: "• Sombrero Venturi Americano\n\n-Medidas: 4'' hasta 12''",
		src: "src/img/sombero-venturi-1.webp",
		src2: "src/img/sombero-venturi-2.webp",
		src3: "src/img/sombero-venturi-3.webp",
		category: "zingueria"
	},
	{
		id: 55,
		name: "Disco De Corte",
		description: "",
		description_2: "• Los Discos Abrasivos TYROLIT XPERT TOOLS Aceros son recomendados para el corte de planchuelas, perfiles, ángulos, tubos, barras y material macizo de aceros de baja y media aleación, aceros inoxidables y fundición.\n\n-Han sido concebidos para ofrecerle una solución más económica para sus problemas de costos en los espesores estándar.\n-Velocidad periférica hasta 80 m/seg.",
		src: "src/img/disco-corte.webp",
		category: "otros"
	},
	{
		id: 56,
		name: "Cenefa",
		description: "20cm - 30cm ",
		description_2: "• Cenefa Galvanizada, terminación y cierre en los bordes del techo. Puede ser frontal o lateral y se utiliza para evitar filtraciones y mejorar la apariencia de dichas uniones. \n\n-Colores: Negro y Galvanizado(Gris)\n\n-Alto: 20cm y 30cm\n-Largo: 2Mts ",
		src: "src/img/57.webp",
		src2: "src/img/57-2.webp",
		src3: "src/img/57-3.webp",
		src4: "src/img/57-4.webp",
		src5: "src/img/57-5.webp",
		category: "zingueria"
	},
	{
		id: 57,
		name: "Grampas Canaleta Americana",
		description: "Con / Sin Brazo",
		description_2: "• Grampas Canaleta Americana (con y sin brazo), para amurar o atornillar a cenefa o frente.Apta para soportar el peso de la canaleta y el agua en caso de tormentas fuertes, no se dobla ni se quiebra. Recomendamos a nuestros clientes tener en cuenta la calidad de este tipo de productos, ya que es la pieza más importante a la hora de la instalación de las canaletas.",
		src: "src/img/58.webp",
		category: "zingueria"
	},
	{
		id: 58,
		name: "Topes Plasticos",
		description: "Acanaladas - Trapezoidal",
		description_2: "• Topes Plasticos para chapas plasticas Acanaladas/Sinusoidal y T101/Trapezoidal",
		src: "src/img/59.webp",
		src2: "src/img/59-2.webp",
		category: "otros"
	},
	{
		id: 59,
		name: "Solera",
		description: "35 / 70",
		description_2: "• Solera para Contruccion en Seco\n\nA: 35mm - 28mm \n\nB: 70mm - 28mm",
		src: "src/img/solera.webp",
		src2: "src/img/solera-2.webp",
		src3: "src/img/solera-3.webp",
		category: "seco"
	},
	{
		id: 60,
		name: "Montante",
		description: "34 / 69",
		description_2: "• Montante para Contruccion en Seco\n\nA: 34mm - 69mm\n\nB: 35mm - 35mm\n\nC: 30mm - 30mm",
		src: "src/img/montante.webp",
		src2: "src/img/montante-2.webp",
		src3: "src/img/montante-3.webp",
		category: "seco"
	},
	{
		id: 61,
		name: "Omega",
		description: "10 / 12,5 / 30",
		description_2: "• Omega para Contruccion en Seco\n\nA: 10mm\n\nB: 12,5mm\n\nC: 30mm",
		src: "src/img/omega.webp",
		src2: "src/img/omega-2.webp",
		src3: "src/img/omega-3.webp",
		category: "seco"
	},
	{
		id: 62,
		name: "Cantonera",
		description: "31 / 31",
		description_2: "• Cantonera para Contruccion en Seco\n\nA: 31mm\n\nB: 31mm",
		src: "src/img/cantonera-3.webp",
		src2: "src/img/cantonera-2.webp",
		category: "seco"
	},
	{
		id: 63,
		name: "Angulo de Ajuste",
		description: "8,5 / 24",
		description_2: "• Angulo de Ajuste para Contruccion en Seco\n\nA: 8,5mm\n\nB: 24mm",
		src: "src/img/angulo.webp",
		src2: "src/img/angulo-2.webp",
		category: "seco"
	},
	{
		id: 64,
		name: "Buña",
		description: "8,5 / 20 / 15",
		description_2: "• Buña para Contruccion en Seco\n\nA: 8,5mm\n\nB: 20mm\n\nC: 15mm",
		src: "src/img/buna.webp",
		src2: "src/img/buna-2.webp",
		category: "seco"
	}
];

function Products() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [itemsQuantity, setItemsQuantity] = useState(JSON.parse(localStorage.getItem("itemsQuantity") || 8));
  const [visibility, setVisibility] = useState(true);
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    const response = await fetch("../../products.json");
    const json = await response.json();
    setProducts(json);
    setLoading(true);
  };
  useEffect(() => {
    fetchData();
  }, []);
  let filtered = [];
  useEffect(() => {
    filtered = products.filter((val) => val.name.toLowerCase().includes(search.toLowerCase()));
    if (itemsQuantity >= filtered.length) {
      setVisibility(false);
    } else if (filtered.length <= 8 && filtered.length >= 0) {
      setVisibility(false);
    } else {
      setVisibility(true);
    }
  }, [search, itemsQuantity, products]);
  const sortCategory = (category) => {
    let inCategory = data.filter((prod) => prod.category === category);
    setVisibility(false);
    setProducts(inCategory);
    setItemsQuantity(inCategory.length);
  };
  return /* @__PURE__ */ jsx(Fragment, {
    children: /* @__PURE__ */ jsxs("div", {
      className: "product-container",
      children: [/* @__PURE__ */ jsx("h2", {
        className: "h2_products",
        id: "products",
        children: "Productos"
      }), /* @__PURE__ */ jsx("div", {
        className: "search_bar_container",
        children: /* @__PURE__ */ jsxs("div", {
          className: "searchBar",
          children: [/* @__PURE__ */ jsx("input", {
            "aria-label": "Escribir Producto",
            onChange: (e) => {
              setSearch(e.target.value);
            },
            id: "searchQueryInput",
            type: "text",
            name: "searchQueryInput",
            placeholder: "Buscar"
          }), /* @__PURE__ */ jsx("button", {
            "aria-label": "Buscar",
            id: "searchQuerySubmit",
            type: "submit",
            name: "searchQuerySubmit",
            children: /* @__PURE__ */ jsx("svg", {
              style: {
                width: 24,
                height: 24
              },
              viewBox: "0 0 24 24",
              children: /* @__PURE__ */ jsx("path", {
                fill: "#666666",
                d: "M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"
              })
            })
          })]
        })
      }), /* @__PURE__ */ jsxs("div", {
        className: "categories-container",
        children: [/* @__PURE__ */ jsx("button", {
          "aria-label": "Todos",
          className: "category-btn",
          onClick: () => {
            setProducts(data);
            setVisibility(true);
            setItemsQuantity(8);
          },
          children: "Todos"
        }), /* @__PURE__ */ jsx("button", {
          "aria-label": "Chapas",
          className: "category-btn",
          onClick: () => sortCategory("chapas"),
          children: "Chapas"
        }), /* @__PURE__ */ jsx("button", {
          "aria-label": "Zingueria",
          className: "category-btn",
          onClick: () => sortCategory("zingueria"),
          children: "Zingueria"
        }), /* @__PURE__ */ jsx("button", {
          "aria-label": "Construccion en seco",
          className: "category-btn",
          onClick: () => sortCategory("seco"),
          children: "Construccion en seco"
        }), /* @__PURE__ */ jsx("button", {
          "aria-label": "Selladores",
          className: "category-btn",
          onClick: () => sortCategory("selladores"),
          children: "Selladores"
        }), /* @__PURE__ */ jsx("button", {
          "aria-label": "Aislantes",
          className: "category-btn",
          onClick: () => sortCategory("aislantes"),
          children: "Aislantes"
        }), /* @__PURE__ */ jsx("button", {
          "aria-label": "Otros",
          className: "category-btn",
          onClick: () => sortCategory("otros"),
          children: "Otros"
        })]
      }), loading ? /* @__PURE__ */ jsxs(Fragment, {
        children: [/* @__PURE__ */ jsx(motion.ul, {
          className: "link-card-grid",
          children: products.filter((val) => val.name.toLowerCase().includes(search.toLowerCase())).slice(0, itemsQuantity).map((val, id) => /* @__PURE__ */ jsx(AnimatePresence, {
            children: /* @__PURE__ */ jsxs(motion.li, {
              layout: true,
              initial: {
                opacity: 0
              },
              transition: {
                opacity: {
                  duration: 1,
                  ease: [0.88, 0.32, 1, 0.88]
                },
                y: {
                  duration: 1,
                  ease: [0.12, 0.98, 0.67, 0.96]
                }
              },
              whileInView: {
                opacity: 1,
                y: 70
              },
              className: "link-card",
              children: [/* @__PURE__ */ jsx("a", {
                href: `/product-details/${val.id}`,
                children: /* @__PURE__ */ jsx("h3", {
                  children: val.name
                })
              }), /* @__PURE__ */ jsx("a", {
                href: `/product-details/${val.id}`,
                children: /* @__PURE__ */ jsx("img", {
                  src: val.src,
                  alt: val.name
                })
              }), /* @__PURE__ */ jsx("p", {
                children: val.description
              })]
            }, val.id)
          }, id))
        }), visibility ? /* @__PURE__ */ jsxs("button", {
          "aria-label": "Mostrar Mas",
          onClick: () => {
            setItemsQuantity(itemsQuantity + 8);
            if (itemsQuantity >= filtered.length - 8) {
              setVisibility(false);
            }
          },
          className: "show-more",
          children: [/* @__PURE__ */ jsx("span", {
            className: "text",
            children: "Ver Mas"
          }), /* @__PURE__ */ jsx("span", {
            children: "↓"
          })]
        }) : /* @__PURE__ */ jsx(Fragment, {})]
      }) : (
        /* Loader */
        /* @__PURE__ */ jsx("div", {
          className: "loader",
          children: /* @__PURE__ */ jsx(Orbit, {
            size: 35,
            speed: 1.5,
            color: "white"
          })
        })
      )]
    })
  });
}
__astro_tag_component__(Products, "@astrojs/react");

const $$Astro$3 = createAstro("https://valenmetal.github.io");
const $$Hero = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Hero;
  return renderTemplate`${maybeRenderHead($$result)}<div class="hero astro-BBE6DXRZ" id="hero">
   <h1 class="hero-title astro-BBE6DXRZ" id="main-title">Zingueria Marquez</h1>
</div>`;
}, "C:/Users/valen/Downloads/proyects/spiffy-series/src/components/Hero.astro");

const $$Astro$2 = createAstro("https://valenmetal.github.io");
const $$Nosotros = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Nosotros;
  return renderTemplate`${maybeRenderHead($$result)}<div class="nosotros astro-ZETW4ZT5">
   <div class="custom-shape-divider-top astro-ZETW4ZT5">
      <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" class="astro-ZETW4ZT5">
         <path d="M1200 120L0 16.48 0 0 1200 0 1200 120z" class="shape-fill astro-ZETW4ZT5"></path>
      </svg>
   </div>
   <div class="container astro-ZETW4ZT5">
      <h3 class="nosotros-title astro-ZETW4ZT5" id="ubicacion">Donde Estamos?</h3>
      <p class="adress-container astro-ZETW4ZT5">
         ${renderComponent($$result, "Icon", $$Icon, { "name": "ic:baseline-location-on", "class": "icon astro-ZETW4ZT5" })}Av. Brig. Gral. Juan
         Manuel de Rosas 2220
      </p>
      <div class="flex-2 astro-ZETW4ZT5">
         <div class="map-container astro-ZETW4ZT5">
            <iframe title="mapa" class="map astro-ZETW4ZT5" src="https://maps.google.com/maps?width=100%25&hl=es&q=Zingueria%20Marquez%20Av.%20Brig.%20Gral.%20Juan%20Manuel%20de%20Rosas%202220,%20B1655%20Jos%C3%A9%20Le%C3%B3n%20Su%C3%A1rez,%20Provincia%20de%20Buenos%20Aires+(Zingueria%20Marquez)&t=&z=16&ie=UTF8&iwloc=B&output=embed">
               <a href="https://www.gps.ie/car-satnav-gps/"> Sat Navs </a>
            </iframe>
         </div>
         <img class="img astro-ZETW4ZT5" src="images/frente.webp" alt="Frente Local Zingueria Marquez">
      </div>
      <div class="back-container astro-ZETW4ZT5">
         <a href="#hero" class="back-to-top astro-ZETW4ZT5">Volver Arriba ${renderComponent($$result, "Icon", $$Icon, { "class": "icon astro-ZETW4ZT5", "name": "ph:arrow-up-bold" })}
         </a>
      </div>
   </div>
</div>`;
}, "C:/Users/valen/Downloads/proyects/spiffy-series/src/components/Nosotros.astro");

const $$Astro$1 = createAstro("https://valenmetal.github.io");
const $$TrabajosAMedida = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$TrabajosAMedida;
  return renderTemplate`${maybeRenderHead($$result)}<div class="trabajos-container astro-IYLUPGZW">
   <div class="custom-shape-divider-top astro-IYLUPGZW">
      <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" class="astro-IYLUPGZW">
         <path d="M1200 120L0 16.48 0 0 1200 0 1200 120z" class="shape-fill astro-IYLUPGZW"></path>
      </svg>
   </div>
   <div class="container astro-IYLUPGZW">
      <h3 class="trabajos-title astro-IYLUPGZW" id="trabajos">
         Trabajos a Medida ${renderComponent($$result, "Icon", $$Icon, { "width": ".8em", "name": "ph:ruler", "class": "astro-IYLUPGZW" })}
      </h3>
      <div class="galeria astro-IYLUPGZW">
         <div class="trabajos-card astro-IYLUPGZW">
            <img src="images/trabajo-a-medida-3.webp" alt="Campana Extractora a Medida" class="astro-IYLUPGZW">
            <p class="astro-IYLUPGZW">Campana</p>
         </div>
         <div class="trabajos-card astro-IYLUPGZW">
            <img src="images/trabajo-a-medida-2.webp" alt="Campana Extractora a Medida" class="astro-IYLUPGZW">
            <p class="astro-IYLUPGZW">Campana</p>
         </div>
         <div class="trabajos-card astro-IYLUPGZW">
            <img src="images/trabajo-a-medida-1.webp" alt="Campana Extractora a Medida" class="astro-IYLUPGZW">
            <p class="astro-IYLUPGZW">Campana</p>
         </div>
         <div class="trabajos-card astro-IYLUPGZW">
            <img src="images/trabajo-a-medida-4.webp" alt="Trampilla a Medida" class="astro-IYLUPGZW">
            <p class="astro-IYLUPGZW">Trampilla</p>
         </div>
         <div class="trabajos-card astro-IYLUPGZW">
            <img src="images/trabajo-a-medida-5.webp" alt="Trampilla a Medida" class="astro-IYLUPGZW">
            <p class="astro-IYLUPGZW">Trampilla</p>
         </div>
         <div class="trabajos-card astro-IYLUPGZW">
            <img src="images/trabajo-a-medida-6.webp" alt="Claraboya a Medida" class="astro-IYLUPGZW">
            <p class="astro-IYLUPGZW">Claraboya</p>
         </div>
      </div>
      <a aria-label="Contactenos via WhatsApp" id="contactar-btn" href="https://api.whatsapp.com/send?phone=5491130206654" class="astro-IYLUPGZW">
         <button class="astro-IYLUPGZW">
            <div class="svg-wrapper-1 astro-IYLUPGZW">
               <div class="svg-wrapper astro-IYLUPGZW">
                  ${renderComponent($$result, "Icon", $$Icon, { "class": "social-logo astro-IYLUPGZW", "name": "ph:whatsapp-logo-light" })}
               </div>
               <span class="astro-IYLUPGZW">Contactar</span>
            </div>
         </button>
      </a>
   </div>
   <div class="custom-shape-divider-bottom astro-IYLUPGZW">
      <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" class="astro-IYLUPGZW">
         <path d="M1200 120L0 16.48 0 0 1200 0 1200 120z" class="shape-fill astro-IYLUPGZW"></path>
      </svg>
   </div>
</div>`;
}, "C:/Users/valen/Downloads/proyects/spiffy-series/src/components/TrabajosAMedida.astro");

const $$Astro = createAstro("https://valenmetal.github.io");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Zingueria Marquez" }, { "default": ($$result2) => renderTemplate`
   ${maybeRenderHead($$result2)}<main>
      ${renderComponent($$result2, "Hero", $$Hero, {})}

      ${renderComponent($$result2, "Products", Products, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/valen/Downloads/proyects/spiffy-series/src/components/ProductsReact.jsx", "client:component-export": "default" })}

      ${renderComponent($$result2, "TrabajosAMedida", $$TrabajosAMedida, {})}

      ${renderComponent($$result2, "Nosotros", $$Nosotros, {})}
   </main>
` })}

`;
}, "C:/Users/valen/Downloads/proyects/spiffy-series/src/pages/index.astro");

const $$file = "C:/Users/valen/Downloads/proyects/spiffy-series/src/pages/index.astro";
const $$url = "/React-Astro-E-Commerce";

export { $$Index as default, $$file as file, $$url as url };
