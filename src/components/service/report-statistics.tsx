

import { IonCard, IonCol, IonContent, IonGrid, IonModal, IonRow, IonToolbar } from '@ionic/react';
import React, { FC } from 'react';
import Donut from 'react-donut';

const ReportStatistics: FC<{}> = function () {
    return (
        <IonModal isOpen={true}>
            <IonToolbar>
                Report Statistic
           </IonToolbar>
            <IonContent>
                <IonGrid>
                    <IonRow>
                        <IonCol>
                            <IonCard>
                                Donut
                                <Donut
                                    chartRadiusRange={[]}
                                    chartData={[
                                        { name: 'Black Panther', data: 30 },
                                        { name: 'Avengers', data: 50 },
                                        { name: 'Antman', data: 20 },
                                    ]}
                                    chartWidth={300}
                                    chartHeight={500}
                                    title="Marvel movies that were popular this year"
                                    chartThemeConfig={{
                                        series: {
                                            colors: ['#ffe0bd', '#670303', '#6cbfce'],
                                        },
                                    }}
                                />
                            </IonCard>
                        </IonCol>
                        <IonCol></IonCol>
                    </IonRow>
                </IonGrid>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sapiente veritatis, ipsum adipisci fuga rerum dignissimos quis minus omnis blanditiis, officia unde eius aspernatur error? Esse earum at velit ipsum similique?
                <Donut
                    chartRadiusRange={[]}
                    chartData={[
                        { name: 'Black Panther', data: 30 },
                        { name: 'Avengers', data: 50 },
                        { name: 'Antman', data: 20 },
                    ]}
                    chartWidth={300}
                    chartHeight={500}
                    title="Marvel movies that were popular this year"
                    chartThemeConfig={{
                        series: {
                            colors: ['#ffe0bd', '#670303', '#6cbfce'],
                        },
                    }}
                />
            </IonContent>
        </IonModal>
    );
};

export default ReportStatistics;