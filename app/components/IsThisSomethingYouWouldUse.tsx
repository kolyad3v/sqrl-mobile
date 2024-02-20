import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, spacing, typography } from "app/theme"
import { Text } from "app/components/Text"
import { Toggle } from "./Toggle"
import { useState } from "react"
import { TextField } from "./TextField"
import { Icon } from "./Icon"
import { Button } from "./Button"

export interface IsThisSomethingYouWouldUseProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  questionID: number
}

/**
 * Describe your component here
 */
export const IsThisSomethingYouWouldUse = observer(function IsThisSomethingYouWouldUse(
  props: IsThisSomethingYouWouldUseProps,
) {
  const { style, questionID } = props
  const $styles = [$container, style]

  const [yesReponse, setYesReponse] = useState(false)
  const [noResponse, setNoResponse] = useState(false)
  const [why, setWhy] = useState("")

  return (
    <View style={$styles}>
      <View style={{}}>
        <Text style={$text}>Is this something you would use? </Text>
        <Toggle
          variant="switch"
          value={yesReponse}
          onValueChange={(value) => {
            setYesReponse(value)
            alert("yes")
          }}
          inputOuterStyle={{ backgroundColor: colors.palette.primary500 }}
          inputInnerStyle={{ backgroundColor: colors.palette.neutral400 }}
          helper="Hell yeah"
          status={noResponse ? "disabled" : undefined}
        />
        <Toggle
          variant="switch"
          value={noResponse}
          onValueChange={(value) => setNoResponse(value)}
          inputOuterStyle={{ backgroundColor: colors.palette.angry500 }}
          inputInnerStyle={{ backgroundColor: colors.palette.neutral400 }}
          helper="nah"
          status={yesReponse ? "disabled" : undefined}
        />
      </View>
      <TextField
        value={why}
        onChangeText={(text) => setWhy(text)}
        label="Any other thoughts?"
        placeholder="The name for a group of koalas should be..."
        RightAccessory={(props) => (
          <Button
            onPress={() => alert("click")}
            RightAccessory={() => (
              <Icon icon="paperPlane" color={colors.palette.primary500} size={24} />
            )}
          />
        )}
      />
    </View>
  )
})

const $container: ViewStyle = {
  justifyContent: "center",
}

const $text: TextStyle = {
  paddingTop: spacing.sm,
  marginBottom: spacing.sm,
  fontFamily: typography.Poppins.bold,
  lineHeight: spacing.xl2,
  flexWrap: "wrap",
  fontSize: 28,
  color: colors.palette.neutral100,
}
