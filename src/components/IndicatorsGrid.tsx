import { Statistics } from '@/types';
import styles from './IndicatorsGrid.module.css';

interface IndicatorsGridProps {
  statistics: Statistics;
}

export default function IndicatorsGrid({ statistics }: IndicatorsGridProps) {
  // Calcular el crecimiento absoluto en miles de millones
  // latest_pbg_value ya está en millones, así que dividimos por 1000 para obtener miles de millones
  const absGrowthBillions = (statistics.latest_pbg_value / 1000) * (statistics.growth_percentage / 100);

  return (
    <section id="indicators" className={styles.indicatorsSection}>
      <div className="container mx-auto px-4">
        <h2 className={`${styles.sectionTitle} text-3xl`}>Indicadores Clave</h2>
        <p className={styles.sectionSubtitle}>Principales métricas del desarrollo económico de Corrientes</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1) Valor PBG del último año */}
          <div className="flex">
            <div className={`${styles.indicatorCard} w-full`}>
              <div className={`${styles.indicatorIcon} ${styles.iconPrimary}`}>
                <i className="fas fa-money-bill-wave"></i>
              </div>
                <div className={`${styles.indicatorValue} ${styles.valuePrimary}`}>
                  ${statistics.latest_pbg_value.toFixed(1)}M
                </div>
              <div className={styles.indicatorLabel}>Valor PBG {statistics.latest_pbg_year}</div>
              <div className={`${styles.indicatorChange} ${styles.changeMuted}`}>Precios constantes 2004</div>
            </div>
          </div>

          {/* 2) Variación interanual */}
          <div className="flex">
            <div className={`${styles.indicatorCard} w-full`}>
              <div className={`${styles.indicatorIcon} ${statistics.variation_yoy >= 0 ? styles.iconSuccess : styles.iconDanger}`}>
                <i className={`fas ${statistics.variation_yoy >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
              </div>
              <div className={`${styles.indicatorValue} ${statistics.variation_yoy >= 0 ? styles.valueSuccess : styles.valueDanger}`}>
                {statistics.variation_yoy >= 0 ? '+' : ''}{statistics.variation_yoy.toFixed(1)}%
              </div>
              <div className={styles.indicatorLabel}>Variación interanual</div>
              <div className={`${styles.indicatorChange} ${statistics.variation_yoy >= 0 ? styles.changeSuccess : styles.changeDanger}`}>
                {statistics.latest_pbg_year - 1}→{statistics.latest_pbg_year}
                <i className={`fas ${statistics.variation_yoy >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'} ml-1`}></i>
              </div>
            </div>
          </div>

          {/* 3) Crecimiento promedio anual (CAGR) */}
          <div className="flex">
            <div className={`${styles.indicatorCard} w-full`}>
              <div className={`${styles.indicatorIcon} ${styles.iconInfo}`}>
                <i className="fas fa-chart-line"></i>
              </div>
              <div className={`${styles.indicatorValue} ${styles.valueInfo}`}>
                +{statistics.cagr.toFixed(1)}%
              </div>
              <div className={styles.indicatorLabel}>Crecimiento promedio anual</div>
              <div className={`${styles.indicatorChange} ${styles.changeMuted}`}>
                {statistics.min_year}–{statistics.max_year}
              </div>
            </div>
          </div>

          {/* 4) Crecimiento acumulado (toda la serie) */}
          <div className="flex">
            <div className={`${styles.indicatorCard} w-full`}>
              <div className={`${styles.indicatorIcon} ${styles.iconWarning}`}>
                <i className="fas fa-chart-area"></i>
              </div>
              <div className={`${styles.indicatorValue} ${styles.valueWarning}`}>
                {statistics.growth_percentage.toFixed(1)}%
              </div>
              <div className={styles.indicatorLabel}>Crecimiento acumulado</div>
              <div className={`${styles.indicatorChange} ${styles.changeMuted}`}>
                {statistics.min_year}–{statistics.max_year}
                {absGrowthBillions > 0 && (
                  <> · <span className={styles.changeSuccess}>+{absGrowthBillions.toFixed(1)}B</span></>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}