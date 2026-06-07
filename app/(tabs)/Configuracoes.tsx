// app/(tabs)/Configuracoes.tsx
// Tela de Configurações — estilos separados em estilosConfiguracoes.ts

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CORES } from '../../src/config';
import { estilosConfiguracoes } from './estilosConfiguracoes';

export default function Configuracoes() {
  const router = useRouter();

  return (
    <SafeAreaView style={estilosConfiguracoes.container}>

      {/* Cabeçalho */}
      <View style={estilosConfiguracoes.cabecalho}>
        <TouchableOpacity onPress={() => router.back()} style={estilosConfiguracoes.botaoVoltar}>
          <Ionicons name="arrow-back" size={24} color={CORES.textoClaro} />
        </TouchableOpacity>
        <Text style={estilosConfiguracoes.titulo}>Configurações</Text>
        <View style={estilosConfiguracoes.espacador} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Seção: Finanças */}
        <Text style={estilosConfiguracoes.tituloSecao}>FINANÇAS</Text>

        <TouchableOpacity
          style={estilosConfiguracoes.opcao}
          onPress={() => router.push('/(tabs)/Metas')}
        >
          <View style={estilosConfiguracoes.opcaoEsquerda}>
            <View style={[estilosConfiguracoes.iconeBox, { backgroundColor: '#FACC1520' }]}>
              <Ionicons name="flag" size={20} color="#FACC15" />
            </View>
            <View>
              <Text style={estilosConfiguracoes.opcaoTitulo}>Metas</Text>
              <Text style={estilosConfiguracoes.opcaoDescricao}>Visualize e gerencie suas metas</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={CORES.textoEscuro} />
        </TouchableOpacity>

        {/* Seção: Conta */}
        <Text style={[estilosConfiguracoes.tituloSecao, { marginTop: 28 }]}>CONTA</Text>

        <TouchableOpacity style={estilosConfiguracoes.opcao} onPress={() => {}}>
          <View style={estilosConfiguracoes.opcaoEsquerda}>
            <View style={[estilosConfiguracoes.iconeBox, { backgroundColor: '#3B82F620' }]}>
              <Ionicons name="person" size={20} color={CORES.azul} />
            </View>
            <View>
              <Text style={estilosConfiguracoes.opcaoTitulo}>Perfil</Text>
              <Text style={estilosConfiguracoes.opcaoDescricao}>Seus dados pessoais</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={CORES.textoEscuro} />
        </TouchableOpacity>

        <TouchableOpacity style={estilosConfiguracoes.opcao} onPress={() => {}}>
          <View style={estilosConfiguracoes.opcaoEsquerda}>
            <View style={[estilosConfiguracoes.iconeBox, { backgroundColor: '#22C55E20' }]}>
              <Ionicons name="grid" size={20} color={CORES.verde} />
            </View>
            <View>
              <Text style={estilosConfiguracoes.opcaoTitulo}>Categorias</Text>
              <Text style={estilosConfiguracoes.opcaoDescricao}>Organize suas categorias</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={CORES.textoEscuro} />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
