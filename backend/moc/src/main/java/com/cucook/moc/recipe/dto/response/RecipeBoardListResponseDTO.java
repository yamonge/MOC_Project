package com.cucook.moc.recipe.dto.response;

import com.cucook.moc.recipe.vo.RecipeBoardListItemVO;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class RecipeBoardListResponseDTO {
    private List<RecipeBoardListItemVO> items;
    private int total;
    private int page;
    private int size;
}
