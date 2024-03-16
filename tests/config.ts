import dotenv from 'dotenv';
import { faker } from '@faker-js/faker/locale/ko';
dotenv.config({ path: './.env.development' });

// .env에 선언된 환경변수 관리
export const config = {
    illuminareanMainUrl: getEnvVar("ILLUMINAREAN_MAIN_URL"),
    illuminareanWorkUrl: getEnvVar("ILLUMINAREAN_WORK_URL"),
    goodvideWorksMainUrl: getEnvVar("GOODVIDE_WORKS_MAIN_URL"),
    goodvideWorksAgreementUrl: getEnvVar("GOODVIDE_WORKS_AGREEMENT_URL"),
    goodvideWorksPrivacyUrl: getEnvVar("GOODVIDE_WORKS_PRIVACY_URL"),
};

// 테스트 데이터 생성
const { company, person, internet, phone } = faker;
const tempMobile: string = phone.number(); // 임의로 생성한 휴대폰 번호
export const fillData = {
    companyName: company.name(), // 회사명
    ceoName: person.fullName(), // 대표자명
    name: person.fullName(), // 담당자명
    email: internet.email(), // 이메일
    mobile: '010-' + tempMobile.substring(tempMobile.length - 8), // 휴대폰 번호 (한국 포맷인 010으로 치환)  
};

/**
 * 환경 변수 값을 가져올 때 기본 값 처리를 해서 제공하는 함수
 * 
 * @param key 환경 변수 key
 * @returns 환경 변수 값
 */
function getEnvVar(key: string): string {
    const value = process.env[key];
    return (value === undefined ? "" : value);
}