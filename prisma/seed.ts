import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const companyList = [
  { label: '강원랜드 카지노', value: '강원랜드 카지노' },
  { label: '파라다이스 카지노 워커힐점', value: '파라다이스 카지노 워커힐점' },
  { label: '인스파이어 카지노', value: '인스파이어 카지노' },
  { label: '세븐럭 카지노 강남코엑스점', value: '세븐럭 카지노 강남코엑스점' },
  {
    label: '세븐럭 카지노 서울드래곤시티점',
    value: '세븐럭 카지노 서울드래곤시티점',
  },
  { label: '세븐럭 카지노 부산롯데점', value: '세븐럭 카지노 부산롯데점' },
  { label: '파라다이스 카지노 부산지점', value: '파라다이스 카지노 부산지점' },
  { label: '파라다이스시티 카지노', value: '파라다이스시티 카지노' },
  { label: '알펜시아 카지노', value: '알펜시아 카지노' },
  { label: '호텔인터불고대구 카지노', value: '호텔인터불고대구 카지노' },
  { label: '공즈 카지노', value: '공즈 카지노' },
  { label: '파라다이스 카지노 제주지점', value: '파라다이스 카지노 제주지점' },
  { label: '세븐스타 카지노', value: '세븐스타 카지노' },
  { label: '제주오리엔탈 카지노', value: '제주오리엔탈 카지노' },
  { label: '드림타워 카지노', value: '드림타워 카지노' },
  { label: '제주썬 카지노', value: '제주썬 카지노' },
  { label: '랜딩 카지노', value: '랜딩 카지노' },
  { label: '메가럭 카지노', value: '메가럭 카지노' },
  {
    label: 'JW 메리어트 제주 리조트 앤 스파',
    value: 'JW 메리어트 제주 리조트 앤 스파',
  },
  { label: 'JW 메리어트 호텔 동대문', value: 'JW 메리어트 호텔 동대문' },
  { label: 'JW 메리어트 호텔 서울', value: 'JW 메리어트 호텔 서울' },
  { label: '경원재 앰배서더 인천', value: '경원재 앰배서더 인천' },
  {
    label: '그랜드 머큐어 앰배서더 용산',
    value: '그랜드 머큐어 앰배서더 용산',
  },
  { label: '그랜드 워커힐 서울', value: '그랜드 워커힐 서울' },
  {
    label: '그랜드 인터컨티넨탈 서울 파르나스',
    value: '그랜드 인터컨티넨탈 서울 파르나스',
  },
  { label: '그랜드 조선 부산', value: '그랜드 조선 부산' },
  { label: '그랜드 조선 제주', value: '그랜드 조선 제주' },
  { label: '그랜드 하얏트 서울', value: '그랜드 하얏트 서울' },
  { label: '그랜드 하얏트 인천', value: '그랜드 하얏트 인천' },
  { label: '그랜드 하얏트 제주', value: '그랜드 하얏트 제주' },
  { label: '네스트 호텔', value: '네스트 호텔' },
  {
    label: '노보텔 스위트 앰배서더 용산',
    value: '노보텔 스위트 앰배서더 용산',
  },
  { label: '노보텔 앰배서더 서울 강남', value: '노보텔 앰배서더 서울 강남' },
  {
    label: '노보텔 앰배서더 서울 동대문',
    value: '노보텔 앰배서더 서울 동대문',
  },
  { label: '노보텔 앰버서더 서울 용산', value: '노보텔 앰버서더 서울 용산' },
  { label: '더 플라자', value: '더 플라자' },
  {
    label: '더블트리 바이 힐튼 서울 판교',
    value: '더블트리 바이 힐튼 서울 판교',
  },
  { label: '라마다 프라자 제주', value: '라마다 프라자 제주' },
  { label: '라한셀렉트 경주', value: '라한셀렉트 경주' },
  { label: '롯데호텔 부산', value: '롯데호텔 부산' },
  { label: '롯데호텔 서울', value: '롯데호텔 서울' },
  { label: '롯데호텔 울산', value: '롯데호텔 울산' },
  { label: '롯데호텔 월드', value: '롯데호텔 월드' },
  { label: '롯데호텔 제주', value: '롯데호텔 제주' },
  { label: '르메르디앙 서울 명동', value: '르메르디앙 서울 명동' },
  {
    label: '메리어트 이그제큐티브 아파트먼트 서울',
    value: '메리어트 이그제큐티브 아파트먼트 서울',
  },
  {
    label: '메리어트 호텔 앤 레지던스 대구',
    value: '메리어트 호텔 앤 레지던스 대구',
  },
  { label: '메이필드 호텔 서울', value: '메이필드 호텔 서울' },
  { label: '몬드리안 서울 이태원', value: '몬드리안 서울 이태원' },
  { label: '반얀트리 클럽 앤 스파 서울', value: '반얀트리 클럽 앤 스파 서울' },
  { label: '비스타 워커힐 서울', value: '비스타 워커힐 서울' },
  { label: '서귀포 KAL호텔', value: '서귀포 KAL호텔' },
  { label: '서울신라호텔', value: '서울신라호텔' },
  { label: '세이지우드 호텔 홍천', value: '세이지우드 호텔 홍천' },
  { label: '소노캄 고양', value: '소노캄 고양' },
  { label: '소노캄 여수', value: '소노캄 여수' },
  { label: '소피텔 앰배서더 서울', value: '소피텔 앰배서더 서울' },
  { label: '쉐라톤 그랜드 인천 호텔', value: '쉐라톤 그랜드 인천 호텔' },
  { label: '스위스 그랜드 호텔', value: '스위스 그랜드 호텔' },
  { label: '스위트 호텔 제주', value: '스위트 호텔 제주' },
  { label: '시그니엘 부산', value: '시그니엘 부산' },
  { label: '시그니엘 서울', value: '시그니엘 서울' },
  { label: '씨마크 호텔', value: '씨마크 호텔' },
  { label: '씨에스호텔앤리조트', value: '씨에스호텔앤리조트' },
  { label: '안다즈 서울 강남', value: '안다즈 서울 강남' },
  { label: '알펜시아 리조트', value: '알펜시아 리조트' },
  { label: '앰배서더 서울 풀만', value: '앰배서더 서울 풀만' },
  { label: '에코랜드 호텔', value: '에코랜드 호텔' },
  { label: '오크우드 프리미어 인천', value: '오크우드 프리미어 인천' },
  {
    label: '오크우드 프리미어 코엑스 센터',
    value: '오크우드 프리미어 코엑스 센터',
  },
  { label: '웨스틴 조선 부산', value: '웨스틴 조선 부산' },
  { label: '웨스틴 조선 서울', value: '웨스틴 조선 서울' },
  { label: '윈덤 그랜드 부산', value: '윈덤 그랜드 부산' },
  {
    label: '인스파이어 엔터테인먼트 리조트',
    value: '인스파이어 엔터테인먼트 리조트',
  },
  { label: '인터불고 엑스코', value: '인터불고 엑스코' },
  { label: '인터컨티넨탈 서울 코엑스', value: '인터컨티넨탈 서울 코엑스' },
  { label: '인터컨티넨탈 알펜시아 평창', value: '인터컨티넨탈 알펜시아 평창' },
  { label: '제주 부영 호텔 앤 리조트', value: '제주 부영 호텔 앤 리조트' },
  { label: '제주 썬 호텔 앤 카지노', value: '제주 썬 호텔 앤 카지노' },
  { label: '제주 오리엔탈 호텔', value: '제주 오리엔탈 호텔' },
  { label: '제주드림타워', value: '제주드림타워' },
  { label: '제주신라호텔', value: '제주신라호텔' },
  {
    label: '제주신화월드 호텔 앤 리조트',
    value: '제주신화월드 호텔 앤 리조트',
  },
  { label: '조선 팰리스 서울 강남', value: '조선 팰리스 서울 강남' },
  { label: '카세로지 호텔', value: '카세로지 호텔' },
  { label: '켄싱턴 호텔 평창', value: '켄싱턴 호텔 평창' },
  { label: '콘래드 서울', value: '콘래드 서울' },
  { label: '토스카나 호텔', value: '토스카나 호텔' },
  { label: '파라다이스 호텔 부산', value: '파라다이스 호텔 부산' },
  { label: '파라다이스시티', value: '파라다이스시티' },
  { label: '파르나스 호텔 제주', value: '파르나스 호텔 제주' },
  { label: '파크 하얏트 부산', value: '파크 하얏트 부산' },
  { label: '파크 하얏트 서울', value: '파크 하얏트 서울' },
  { label: '페어몬트 앰배서더 서울', value: '페어몬트 앰배서더 서울' },
  { label: '포 시즌스 호텔 서울', value: '포 시즌스 호텔 서울' },
  { label: '하이원', value: '하이원' },
  { label: '호텔 나루 서울 엠갤러리', value: '호텔 나루 서울 엠갤러리' },
  { label: '호텔 오노마', value: '호텔 오노마' },
  { label: '호텔 인터불고 대구', value: '호텔 인터불고 대구' },
  { label: '호텔농심', value: '호텔농심' },
  {
    label: '홀리데이 인 리조트 알펜시아 평창',
    value: '홀리데이 인 리조트 알펜시아 평창',
  },
  { label: '히든 클리프 호텔', value: '히든 클리프 호텔' },
  { label: '힐튼 경주', value: '힐튼 경주' },
];

async function main() {
  for (const company of companyList) {
    await prisma.company.upsert({
      where: { name: company.label }, // company.value 대신 company.label
      update: {},
      create: {
        name: company.label,
      },
    });
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
