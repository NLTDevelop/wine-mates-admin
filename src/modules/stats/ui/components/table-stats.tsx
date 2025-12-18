import { Badge } from "@/UIKit/shadcn/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/UIKit/shadcn/ui/card"
import { TabsContent } from "@/UIKit/shadcn/ui/tabs"
import { Star } from "lucide-react"
import { Fragment } from "react/jsx-runtime"

interface TableStatsProps {
  ageGroups: string[]
  years: number[]
  aggregatedData: any
}

export const TableStats = ({ageGroups, years,aggregatedData}:TableStatsProps) => {
  return (
       <TabsContent value="detailed">
            <Card>
              <CardHeader>
                <CardTitle/>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">Рік</th>
                        <th className="text-left p-3 font-medium">Стать</th>
                        {ageGroups.map(group => (
                          <th key={group} colSpan={2} className="text-center p-3 font-medium border-x">
                            {group} років
                          </th>
                        ))}
                      </tr>
                      <tr className="border-b">
                        <th className="p-2"></th>
                        <th className="p-2"></th>
                        {ageGroups.map(group => (
                          <Fragment key={group}>
                            <th className="p-2 text-center text-xs text-muted-foreground border-x">кількість</th>
                            <th className="p-2 text-center text-xs text-muted-foreground border-x">рейтинг</th>
                          </Fragment>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {years.map(year => (
                        <Fragment key={year}>
                          {/* Мужчины */}
                          <tr className="border-b hover:bg-muted/50">
                            <td rowSpan={2} className="p-3 align-top font-medium border-r">
                              {year}
                            </td>
                            <td className="p-3 align-top border-r">
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                👨 Чоловіки
                              </Badge>
                            </td>
                            {ageGroups.map(ageGroup => {
                              const data = aggregatedData[`${year}-male-${ageGroup}`]
                              return (
                                <Fragment key={`${year}-male-${ageGroup}`}>
                                  <td className="p-3 text-center border-r">{data ? data.ratingsCount : '-'}</td>
                                  <td className="p-3 text-center border-r">
                                    {data ? (
                                      <div className="flex items-center justify-center">
                                        <span className="font-medium">{data.averageRating.toFixed(1)}</span>
                                        <Star className="ml-1 h-3 w-3 text-yellow-500 fill-yellow-500" />
                                      </div>
                                    ) : (
                                      '-'
                                    )}
                                  </td>
                                </Fragment>
                              )
                            })}
                          </tr>

                          <tr className="border-b hover:bg-muted/50">
                            <td className="p-3 align-top border-r">
                              <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">
                                👩 Жінки
                              </Badge>
                            </td>
                            {ageGroups.map(ageGroup => {
                              const data = aggregatedData[`${year}-female-${ageGroup}`]
                              return (
                                <Fragment key={`${year}-female-${ageGroup}`}>
                                  <td className="p-3 text-center border-r">{data ? data.ratingsCount : '-'}</td>
                                  <td className="p-3 text-center border-r">
                                    {data ? (
                                      <div className="flex items-center justify-center">
                                        <span className="font-medium">{data.averageRating.toFixed(1)}</span>
                                        <Star className="ml-1 h-3 w-3 text-yellow-500 fill-yellow-500" />
                                      </div>
                                    ) : (
                                      '-'
                                    )}
                                  </td>
                                </Fragment>
                              )
                            })}
                          </tr>
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
  )
}
