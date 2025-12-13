
import React from 'react';
import { useGLTF } from '@react-three/drei';

export function Model({ material, ...props }) {
  try {
    const { nodes } = useGLTF('/models/player.glb');
    console.log('Model loaded successfully, nodes:', Object.keys(nodes));
    return (
      <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane003.geometry}
        material={material}
        position={[147.535, 1695.285, -283.678]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={945.138}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.H_M_A_nickZ_L4_Group11_H_M_A_nickZ_L4_polySurface1001.geometry}
        material={material}
        position={[-0.017, 4.266, 1.286]}
        scale={5.641}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.H_M_A_nickZ_L4_Group275_H_M_A_nickZ_L4_polySurface1001.geometry}
        material={material}
        position={[0.461, 8.276, 0]}
        scale={5.62}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.H_M_A_nickZ_L4_Group29525_H_M_A_nickZ_L4_polySurface1001.geometry}
        material={material}
        position={[0.461, 8.276, 0]}
        scale={5.62}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.H_M_A_nickZ_L4_Group305_H_M_A_nickZ_L4_polySurface1001.geometry}
        material={material}
        position={[-0.017, 4.266, 1.286]}
        scale={5.641}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.H_M_A_nickZ_L4_Group32328_H_M_A_nickZ_L4_polySurface1001.geometry}
        material={material}
        position={[-0.061, 0.253, 0]}
        scale={5.655}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.H_M_A_nickZ_L4_Group32341_H_M_A_nickZ_L4_polySurface1001.geometry}
        material={material}
        position={[-0.061, 0.253, 0]}
        scale={5.655}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.H_M_A_nickZ_L4_Group35089_H_M_A_nickZ_L4_polySurface1001.geometry}
        material={material}
        position={[-0.017, 4.266, 1.286]}
        scale={5.641}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.H_M_A_nickZ_L4_Group51932_H_M_A_nickZ_L4_polySurface1001.geometry}
        material={material}
        position={[0.461, 8.276, 0]}
        scale={5.62}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.H_M_A_nickZ_L4_Group57688_H_M_A_nickZ_L4_polySurface1001.geometry}
        material={material}
        position={[-0.061, 0.253, 0]}
        scale={5.655}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.H_M_A_nickZ_L4_Group5_H_M_A_nickZ_L4_polySurface1001.geometry}
        material={material}
        position={[-0.061, 0.253, 0]}
        scale={5.655}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.H_M_A_nickZ_L4_Group55_H_M_A_nickZ_L4_polySurface1001.geometry}
        material={material}
        position={[-0.355, 1.479, 0]}
        scale={5.655}
      />
    </group>
  );
  } catch (error) {
    console.error('Error loading 3D model:', error);
    // Return a simple sphere as fallback
    return (
      <mesh {...props}>
        <sphereGeometry args={[1, 32, 32]} />
        {material || <meshStandardMaterial color="#00ffff" />}
      </mesh>
    );
  }
}

useGLTF.preload('/models/player.glb');
