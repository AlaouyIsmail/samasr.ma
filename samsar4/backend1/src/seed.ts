import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './common/entities/user.entity';
import { Agent } from './common/entities/agent.entity';
import { Property } from './common/entities/property.entity';
import { PropertyStats } from './common/entities/property-stats.entity';
import { AgentStats } from './common/entities/agent-stats.entity';
import { Contract } from './common/entities/contract.entity';
import { Notification } from './common/entities/notification.entity';

const ds = new DataSource({
  type: 'sqlite', database: 'samsar.db',
  entities: [User, Agent, Property, PropertyStats, AgentStats, Contract, Notification],
  synchronize: true,
});

async function seed() {
  await ds.initialize();
  const uR = ds.getRepository(User), aR = ds.getRepository(Agent), pR = ds.getRepository(Property);
  const psR = ds.getRepository(PropertyStats), asR = ds.getRepository(AgentStats);
  const nR = ds.getRepository(Notification), cR = ds.getRepository(Contract);

  await nR.delete({}); await cR.delete({}); await psR.delete({}); await asR.delete({});
  await pR.delete({}); await aR.delete({}); await uR.delete({});

  const h = (p: string) => bcrypt.hash(p, 10);
  const exp = new Date(); exp.setDate(exp.getDate() + 30);

  await uR.save(uR.create({ email: 'admin@samsar.ma', password: await h('admin123'), role: 'admin' }));
  const u1 = await uR.save(uR.create({ email: 'karim@samsar.ma', password: await h('agent123'), role: 'agent' }));
  const u2 = await uR.save(uR.create({ email: 'fatima@samsar.ma', password: await h('agent123'), role: 'agent' }));
  const u3 = await uR.save(uR.create({ email: 'youssef@samsar.ma', password: await h('agent123'), role: 'agent' }));
  const u4 = await uR.save(uR.create({ email: 'laila@samsar.ma', password: await h('agent123'), role: 'agent' }));

  const a1 = await aR.save(aR.create({ userId: u1.id, name: 'Karim Bennani', phone: '+212612345678', city: 'Casablanca', bio: 'Expert immobilier depuis 10 ans à Casablanca.', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80', planActive: true, planExpiresAt: exp.toISOString() }));
  const a2 = await aR.save(aR.create({ userId: u2.id, name: 'Fatima El Amrani', phone: '+212623456789', city: 'Marrakech', bio: 'Spécialiste riads et villas de luxe.', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80', planActive: true, planExpiresAt: exp.toISOString() }));
  const a3 = await aR.save(aR.create({ userId: u3.id, name: 'Youssef Idrissi', phone: '+212634567890', city: 'Rabat', bio: 'Agent certifié Rabat-Salé-Kénitra.', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', planActive: false }));
  const a4 = await aR.save(aR.create({ userId: u4.id, name: 'Laila Benjelloun', phone: '+212645678901', city: 'Tanger', bio: 'Spécialiste nord Maroc — Tanger, Tétouan.', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80', planActive: true, planExpiresAt: exp.toISOString() }));

  for (const a of [a1,a2,a3,a4]) await asR.save(asR.create({ agentId: a.id, profileViews: Math.floor(Math.random()*500)+50 }));

  const props = [
    { agentId: a1.id, title: 'Appartement moderne — Maarif', description: 'Bel appartement moderne au cœur de Maarif. Immeuble récent, ascenseur, parking sous-sol. Proche toutes commodités.', price: 1200000, city: 'Casablanca', district: 'Maarif', type: 'SALE', propertyType: 'apartment', surface: 120, rooms: 3, bathrooms: 2, images: JSON.stringify(['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80','https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80']), isFeatured: true, lat: 33.5731, lng: -7.5898 },
    { agentId: a2.id, title: 'Villa avec piscine — Palmeraie', description: 'Magnifique villa avec piscine privée dans la Palmeraie. Grand jardin paysagé, vue montagne, finitions luxe.', price: 4500000, city: 'Marrakech', district: 'Palmeraie', type: 'SALE', propertyType: 'villa', surface: 350, rooms: 5, bathrooms: 4, images: JSON.stringify(['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80']), isFeatured: true, lat: 31.6295, lng: -7.9811 },
    { agentId: a1.id, title: 'Riad rénové — Médina de Fès', description: 'Riad authentique entièrement rénové. Patio central avec fontaine, 4 suites, terrasse panoramique sur la médina.', price: 2800000, city: 'Fès', district: 'Médina', type: 'SALE', propertyType: 'riad', surface: 280, rooms: 6, bathrooms: 4, images: JSON.stringify(['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80','https://images.unsplash.com/photo-1584738766473-61c083514bf4?w=800&q=80']), isFeatured: true, lat: 34.0181, lng: -5.0078 },
    { agentId: a4.id, title: 'Appartement vue mer — Malabata', description: 'Vue panoramique sur le détroit de Gibraltar. Résidence sécurisée, piscine, gardien 24h.', price: 1800000, city: 'Tanger', district: 'Malabata', type: 'SALE', propertyType: 'apartment', surface: 95, rooms: 2, bathrooms: 1, images: JSON.stringify(['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80']), isFeatured: false, lat: 35.7595, lng: -5.8340 },
    { agentId: a2.id, title: 'Villa contemporaine — Agdal', description: 'Villa moderne dans quartier résidentiel calme. Architecture contemporaine, jardin paysagé, garage double.', price: 3200000, city: 'Rabat', district: 'Agdal', type: 'SALE', propertyType: 'villa', surface: 220, rooms: 4, bathrooms: 3, images: JSON.stringify(['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80']), isFeatured: false, lat: 33.9716, lng: -6.8498 },
    { agentId: a3.id, title: 'Studio meublé — Agadir Centre', description: 'Studio idéal investissement locatif. Proche plage 500m. Meublé complet, wifi inclus.', price: 450000, city: 'Agadir', district: 'Centre Ville', type: 'SALE', propertyType: 'apartment', surface: 45, rooms: 1, bathrooms: 1, images: JSON.stringify(['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80']), isFeatured: false, lat: 30.4278, lng: -9.5981 },
    { agentId: a1.id, title: 'Appartement à louer — Ain Diab', description: 'Face à la mer, terrasse 40m², parking, gardien. Disponible immédiatement.', price: 12000, city: 'Casablanca', district: 'Ain Diab', type: 'RENT', propertyType: 'apartment', surface: 140, rooms: 3, bathrooms: 2, images: JSON.stringify(['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80']), isFeatured: true, lat: 33.5892, lng: -7.6603 },
    { agentId: a4.id, title: 'Terrain — Souissi Rabat', description: 'Terrain constructible 500m² dans quartier résidentiel. R+2 autorisé. Documents en règle.', price: 2200000, city: 'Rabat', district: 'Souissi', type: 'SALE', propertyType: 'land', surface: 500, images: JSON.stringify(['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80']), isFeatured: false, lat: 33.9917, lng: -6.8525 },
    { agentId: a2.id, title: 'Local commercial — Gueliz', description: 'Local 80m² en plein cœur de Gueliz. Fort passage piétons. Idéal boutique ou restaurant.', price: 8500, city: 'Marrakech', district: 'Gueliz', type: 'RENT', propertyType: 'commercial', surface: 80, images: JSON.stringify(['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80']), isFeatured: false, lat: 31.6226, lng: -8.0139 },
    { agentId: a1.id, title: 'Penthouse — CIL Casablanca', description: 'Penthouse d\'exception. Terrasse 200m² avec vue 360°. Finitions premium, domotique complète.', price: 6500000, city: 'Casablanca', district: 'CIL', type: 'SALE', propertyType: 'apartment', surface: 300, rooms: 5, bathrooms: 4, images: JSON.stringify(['https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80']), isFeatured: true, lat: 33.5892, lng: -7.6295 },
    { agentId: a3.id, title: 'Villa — Route de Ouarzazate', description: 'Villa berbère authentique avec jardin d\'oliviers. Vue Atlas, piscine, hammam.', price: 3800000, city: 'Marrakech', district: 'Route de Ouarzazate', type: 'SALE', propertyType: 'villa', surface: 400, rooms: 6, bathrooms: 5, images: JSON.stringify(['https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80']), isFeatured: false, lat: 31.5929, lng: -7.9825 },
    { agentId: a4.id, title: 'Appartement — Hay Riad', description: 'Appartement neuf dans résidence sécurisée. Cuisine équipée, balcon, parking.', price: 950000, city: 'Rabat', district: 'Hay Riad', type: 'SALE', propertyType: 'apartment', surface: 85, rooms: 2, bathrooms: 1, images: JSON.stringify(['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80']), isFeatured: false, lat: 33.9511, lng: -6.8581 },
  ];

  for (const p of props) {
    const saved = await pR.save(pR.create(p as any));
    await psR.save(psR.create({ propertyId: saved.id, views: Math.floor(Math.random()*2000)+100, likes: Math.floor(Math.random()*200)+10, saves: Math.floor(Math.random()*100)+5, whatsappClicks: Math.floor(Math.random()*80)+5 }));
  }

  await nR.save([
    nR.create({ agentId: a1.id, message: 'Bienvenue sur SAMSAR ! Votre compte est actif.', type: 'success', isRead: false }),
    nR.create({ agentId: a1.id, message: '"Appartement Maarif" a reçu 145 vues cette semaine.', type: 'info', isRead: false }),
    nR.create({ agentId: a1.id, message: 'Votre plan expire dans 30 jours. Pensez à renouveler.', type: 'warning', isRead: true }),
    nR.create({ agentId: a2.id, message: 'Bienvenue ! Votre plan premium est actif.', type: 'success', isRead: false }),
    nR.create({ agentId: a2.id, message: '"Villa Palmeraie" a été sauvegardée 23 fois.', type: 'info', isRead: false }),
  ]);

  console.log('\n✅ Seed OK!\n');
  console.log('👤 admin@samsar.ma / admin123');
  console.log('🏠 karim@samsar.ma / agent123 (actif)');
  console.log('🏠 fatima@samsar.ma / agent123 (actif)');
  console.log('⏳ youssef@samsar.ma / agent123 (en attente)');
  console.log('🏠 laila@samsar.ma / agent123 (actif)\n');
  await ds.destroy();
}

seed().catch(e => { console.error(e); process.exit(1); });
